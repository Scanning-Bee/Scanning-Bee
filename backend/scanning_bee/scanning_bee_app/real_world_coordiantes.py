import numpy as np
import cv2
import pandas as pd

def get_camera_info(camera_info_file_path):
    camera_info = pd.read_csv(camera_info_file_path)
    D_values = camera_info.filter(like='field.D').iloc[0].values
    K_values = camera_info.filter(like='field.K').iloc[0].values

    D = np.array(D_values) # the distortion coefficients array
    K = np.array(K_values).reshape((3, 3)) # the intrinsic matrix

    return K, D

def project_point(point_3d, camera_info_file_path='backend/scanning_bee/scanning_bee_app/camera_info.csv'):
    """
    Projects a 3D point to 2D using the camera intrinsic matrix and distortion coefficients.

    point_3d: A 3D point in the camera's coordinate frame (numpy array or list)
    K: The intrinsic camera matrix
    D: The distortion coefficients
    """

    K, D = get_camera_info(camera_info_file_path)

    # Checks shape
    points_3d = np.array([point_3d], dtype=np.float64).reshape(-1, 1, 3)

    # Zero rotation and translation vectors
    rvec = np.zeros((3, 1), dtype=np.float64)  # Zero rotation vector
    tvec = np.zeros((3, 1), dtype=np.float64)  # Zero translation vector

    # Project points using the regular distortion model
    points_2d, _ = cv2.projectPoints(points_3d, rvec, tvec, K, D)

    point_2d = points_2d[0, 0]
    
    return point_2d


def find_real_world_coordinates(point_2d, depth, K, D):
    """
    Find the real-world 3D coordinates from 2D image coordinates.

    depth: The depth value at the 2D point
    K: The intrinsic camera matrix
    D: The distortion coefficients
    """

    # Checks shape
    point_2d = np.array(point_2d, dtype=np.float64).reshape(-1, 1, 2)

    # Correct for distortion
    undistorted_point_2d = cv2.undistortPoints(point_2d, K, D, None, K)

    # Convert to normalized camera coordinates
    normalized_x = undistorted_point_2d[0,0,0]
    normalized_y = undistorted_point_2d[0,0,1]

    # Scale by depth to get real-world coordinates in the camera frame
    # Adjust the scaling by focal length and principal point
    fx, fy = K[0,0], K[1,1] # Focal lengths
    cx, cy = K[0,2], K[1,2] # Principal point
    real_world_x = (normalized_x - cx) * depth / fx
    real_world_y = (normalized_y - cy) * depth / fy
    real_world_z = depth

    return np.array([real_world_x, real_world_y])


def calculate_annotation_position(center_x, center_y, x_pos, y_pos, image_width=1980, image_height=1080, camera_info_file_path='scanning_bee_app/camera_info.csv'):
    """
    Calculate the normalized position of an annotation in the larger frame.

    Args:
    - center_x, center_y: Pixel coordinates of the annotation in the image.
    - x_pos, y_pos: Normalized position of the camera in the larger frame.
    - K: Intrinsic matrix of the camera.
    - D: Distortion coefficients of the camera.
    - depth: Constant depth for all annotations.
    - image_width, image_height: Dimensions of the captured image.

    Returns:
    - combined_x, combined_y: Normalized position of the annotation in the larger frame.
    """
    K, D = get_camera_info(camera_info_file_path)

    depth = 1 

    # Convert the annotation's position using the camera's intrinsic properties
    real_world_coords = find_real_world_coordinates([center_x, center_y], depth, K, D)

    # Normalize the adjusted 2D coordinates
    norm_real_world_x = real_world_coords[0] / image_width
    norm_real_world_y = real_world_coords[1] / image_height

    # Combine with the camera's normalized position
    combined_x = x_pos + norm_real_world_x
    combined_y = y_pos + norm_real_world_y

    return combined_x, combined_y










