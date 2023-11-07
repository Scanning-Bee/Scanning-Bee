#!/usr/bin/env python
import sys
import time
import os

# numpy and scipy
import numpy as np
from scipy import ndimage

# OpenCV
import cv2
from PIL import Image

# Ros libraries
import rospy

# Ros Messages
from sensor_msgs.msg import CompressedImage, JointState
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped

DETECTION_THRESHOLD = 0.2
MOVING_THRESHOLD = 0 #step of xy table

COLOR = (0, 0, 255)  # BGR
THICKNESS = 2
FONTSCALE = 0.5

class extract_jpeg:
    def __init__(self):
        self.image_np = None
        self.frame_num = 0
    
        self.xy_moving = False

        self.xy = [0.06, 0.04]

        '''Initialize ros publisher, ros subscriber'''
        
        self.subscriber = rospy.Subscriber("/hive_2/xy_0/camera/image_mono/compressed",
                                           CompressedImage, self.get_frame,  queue_size=1)
        #self.subscriber = rospy.Subscriber("/hive_2/xy_0/comb_snapshot_zoomed/compressed",
        #                                   CompressedImage, self.get_frame,  queue_size=1)
        #self.subscriber = rospy.Subscriber("/hive_2/xy_0/whycon/bee_position",
        #                                    BeePositionArray, self.get_position, queue_size=1)

        self.subscriber = rospy.Subscriber("/hive_2/xy_0/xy_position",
                                            PoseStamped, self.get_position, queue_size=1)

        self.image_pub = rospy.Publisher("/output/image_raw/compressed",
                                         CompressedImage, queue_size=1)
       
    def get_position(self, ros_data):
        print(((ros_data.pose.position.x-self.xy[0])**2 + (ros_data.pose.position.y-self.xy[1])**2) ** 0.5 > MOVING_THRESHOLD)
        if( ((ros_data.pose.position.x-self.xy[0])**2 + (ros_data.pose.position.y-self.xy[1])**2) ** 0.5 > MOVING_THRESHOLD and not(self.xy_moving)):
            self.xy_moving = True
            self.xy[0] = ros_data.pose.position.x
            self.xy[1] = ros_data.pose.position.y

        else:
            self.xy_moving = False

    def get_frame(self, ros_data):
        self.frame_num += 1
        
        np_arr = np.fromstring(ros_data.data, np.uint8)
        self.image_np = cv2.imdecode(np_arr, 0) 
        self.image_np = cv2.cvtColor(self.image_np, cv2.COLOR_GRAY2RGB)
        # TODO: CHECK IF THERE IS A FLAG DIRECTLY ALLOWING THE COLOR CONVERSION

        if(self.xy_moving):
            cv2.imwrite('/home/arilab/Desktop/hive_cell_state/' + str(self.frame_num)  + '.jpg', self.image_np)
        
        msg = CompressedImage()
        msg.header.stamp = rospy.Time.now()
        msg.format = "jpeg"
        msg.data = np.array(cv2.imencode('.jpg', self.image_np)[1]).tobytes()
            # Publish new image
        self.image_pub.publish(msg)
        
def main(args):
    '''Initializes and cleanup ros node'''
    ic = extract_jpeg()
    rospy.init_node('extract_jpeg', anonymous=True)
    try:
        rospy.spin()
    except KeyboardInterrupt:
        print("Shutting down ROS Image feature extractor module")

if __name__ == '__main__':
    main(sys.argv)