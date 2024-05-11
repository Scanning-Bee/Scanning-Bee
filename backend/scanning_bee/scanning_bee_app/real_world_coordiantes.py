import numpy as np
import cv2
import pandas as pd
from typing import Tuple

def euclidean_distance(p1, p2):
    return np.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def get_camera_info(camera_info_file_path="scanning_bee_app/camera_info.csv") -> Tuple[np.ndarray, np.ndarray]:
    try:
        # Read the CSV file using Pandas
        camera_info = pd.read_csv(camera_info_file_path)
        
        # Extract distortion coefficients and intrinsic matrix values
        D_values = camera_info.filter(like='field.D').iloc[0].values
        K_values = camera_info.filter(like='field.K').iloc[0].values
        
        # Convert to numpy arrays and reshape the intrinsic matrix to 3x3
        D = np.array(D_values, dtype=np.float64)  # Ensure the type is float64 for OpenCV compatibility
        K = np.array(K_values, dtype=np.float64).reshape((3, 3))  # Reshape K to be a 3x3 matrix
        
        return K, D
    
    except Exception as e:
        raise ValueError(f"An error occurred while reading the camera info: {e}")

def real_world_alternative(x_pos_norm, y_pos_norm, z_distance, points_2d, camera_info_path="scanning_bee_app/camera_info.csv"):
    K, D = get_camera_info(camera_info_path)
    points_2d = np.array(points_2d, dtype=np.float32).reshape(-1, 1, 2)
    
    # step 1: Undistort points
    undistorted_points = cv2.undistortPoints(points_2d, K, D, None, K)
    undistorted_points = undistorted_points.reshape(-1, 2)

    # calculate the pixel size (in meters)
    pixel_size = z_distance / K[0, 0]

    # step 2: Convert pixel coordinates to meters
    # coordinates are centered around the optical center and scaled
    real_world_x = (undistorted_points[:, 0] - K[0, 2]) * pixel_size
    real_world_y = (undistorted_points[:, 1] - K[1, 2]) * pixel_size

    # add the real world camera translations to the converted coordinate values
    real_world_x += x_pos_norm
    real_world_y += y_pos_norm

    # print(np.column_stack((real_world_x, real_world_y)))
    return (real_world_x, real_world_y)

def convert_to_world_coordinates(point_2d, x_pos, y_pos, Z=0.05, camera_info_path="scanning_bee_app/camera_info.csv"):
    """
    Converts a 2D point in image coordinates (origin at top left, resolution 1920x1080) 
    to 3D world coordinates (origin at bottom left) using the camera's calibration data.

    :param point_2d: A tuple or list with the x, y coordinates of the point in the image.
    :param x_pos: The x position of the camera in world coordinates, starts from the bottom left corner, increases to the right.
    :param y_pos: The y position of the camera in world coordinates, starts from the bottom left corner, increases upwards.
    :param Z: Assumed depth for the 3D point. Defaults to 0.5.
    :param camera_info_path: Path to the camera calibration data.
    :return: A tuple representing the 3D point in world coordinates.
    """
    K, D = get_camera_info(camera_info_path)  # Load camera intrinsic matrix and distortion coefficients
    
    # Adjust for distortion
    point_2d = np.array(point_2d, dtype='float64').reshape(1, 1, 2)
    undistorted_point = cv2.undistortPoints(point_2d, K, D, None, K)
    
    #real_world_alternative(K, D, x_pos, y_pos, 0.05, point_2d)

    # Adjust for the y-coordinate inversion due to different origins
    # Image height is 1080 pixels for a 1920x1080 resolution
    image_height = 1080
    adjusted_y = image_height - undistorted_point[0][0][1]
    
    # Convert to world coordinates considering the Z depth
    point_3d_world = np.dot(np.linalg.inv(K), [undistorted_point[0][0][0], adjusted_y, 1]) * Z
    world_x = point_3d_world[0] + x_pos
    world_y = point_3d_world[1] + y_pos

    return world_x, world_y

if __name__ == "__main__":
    # Test the conversion function

    # point41 and point42_1 are the same point in the real world
    # point42_1 and point42_2 are different but adjacent points in the real world
    # picture41 is shifted to the left approximately 4-5 cells => picture42

    xpos41 = 0.21207468211650848
    ypos41 = 0.33764541149139404

    xpos42 = 0.18759207427501678
    ypos42 = 0.3375004529953003

    point41 = (404, 242)

    point42_1 = (1182,234)

    point42_2 = (1108, 378)

    xpos_im224 =  0.2154335230588913
    ypos_im224 =  0.012625216506421566
    im224_pupa = (1062, 303)
    im224_dark_cell_1 = (992, 445)
    im224_dark_cell_2 = (1158, 460)

    xpos_im232 = 0.23749999701976776
    ypos_im232 = 0.01249849796295166
    im232_pupa = (302, 328)
    im232_dark_cell_1 = (231, 474)
    im232_dark_cell_2 = (392, 473)

    print("--------------------------------------")
    x41, y41 = convert_to_world_coordinates(point41, xpos41, ypos41, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print("point41  : ", x41, y41)

    print("--------------------------------------")
    x42_1, y42_1 = convert_to_world_coordinates(point42_1, xpos42, ypos42, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print("point42_1: ", x42_1, y42_1)

    print("--------------------------------------")
    x42_2, y42_2 = convert_to_world_coordinates(point42_2, xpos42, ypos42, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print("point42_2: ", x42_2, y42_2)
    print("--------------------------------------")
    print("If we select a point from the middle of the frame, it should be at the same")
    print("real world coordinates as the camera itself, right?")
    x_const, y_const = convert_to_world_coordinates((1920/2, 1080/2), xpos42, ypos42, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print(f"camera coordinates: {xpos42} {ypos42}")
    print(f"returned real world coordinates: {x_const}, {y_const}")
    print("--------------------------------------")
    z_distance = 0.06
    print(f"Z distance is set to be {z_distance}.")
    print(f"Now, we expect to get the same output out of both images, looking at a pupa.")
    x_const_224_pupa, y_const_224_pupa = real_world_alternative(xpos_im224, ypos_im224, z_distance, im224_pupa, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print(f"(im 224) {x_const_224_pupa} {y_const_224_pupa}")
    x_const_232_pupa, y_const_232_pupa = real_world_alternative(xpos_im232, ypos_im232, z_distance, im232_pupa, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print(f"(im 232) {x_const_232_pupa} {y_const_232_pupa}")
    print(f"distance between these two points: {euclidean_distance((x_const_224_pupa, y_const_224_pupa), (x_const_232_pupa, y_const_232_pupa))}")
    print("--------------------------------------")
    print(f"Carrying out a similar operation to a dark cell (1)")
    x_const_224_dc1, y_const_224_dc1 = real_world_alternative(xpos_im224, ypos_im224, z_distance, im224_dark_cell_1, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print(f"(im 224) {x_const_224_dc1} {y_const_224_dc1}")
    x_const_232_dc1, y_const_232_dc1 = real_world_alternative(xpos_im232, ypos_im232, z_distance, im232_dark_cell_1, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print(f"(im 232) {x_const_232_dc1} {y_const_232_dc1}")
    print(f"distance between these two points: {euclidean_distance((x_const_224_dc1, y_const_224_dc1), (x_const_232_dc1, y_const_232_dc1))}")
    print("--------------------------------------")
    print(f"Carrying out a similar operation to a dark cell (2)")
    x_const_224_dc2, y_const_224_dc2 = real_world_alternative(xpos_im224, ypos_im224, z_distance, im224_dark_cell_2, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print(f"(im 224) {x_const_224_dc2} {y_const_224_dc2}")
    x_const_232_dc2, y_const_232_dc2 = real_world_alternative(xpos_im232, ypos_im232, z_distance, im232_dark_cell_2, camera_info_path="backend/scanning_bee/scanning_bee_app/camera_info.csv")
    print(f"(im 232) {x_const_232_dc2} {y_const_232_dc2}")
    print(f"distance between these two points: {euclidean_distance((x_const_224_dc2, y_const_224_dc2), (x_const_232_dc2, y_const_232_dc2))}")
    print("--------------------------------------")
    print(f"Cross-distance to check for consistency.")
    print("--------------------------------------")
    print(f"The distance between the pupa and the dark cell (1): {euclidean_distance((x_const_224_pupa, y_const_224_pupa), (x_const_232_dc1, y_const_232_dc1))}")
    print("--------------------------------------")
    print(f"The distance between the pupa and the dark cell (2): {euclidean_distance((x_const_224_pupa, y_const_224_pupa), (x_const_232_dc2, y_const_232_dc2))}")
    print("--------------------------------------")
    print(f"The distance between the dark cell (1) and the dark cell (2): {euclidean_distance((x_const_224_dc1, y_const_224_dc1), (x_const_232_dc2, y_const_232_dc2))}")
    print("--------------------------------------")
    print(f"Also, the real world distance between two cells in a single frame should also be consistent, right?")
    print(f"The euclidean distance between pupa and the dark cell (1) in frame 224: {euclidean_distance((x_const_224_pupa, y_const_224_pupa), (x_const_224_dc1, y_const_224_dc1))}")
    print("--------------------------------------")

    
    # Euclidean distance 41 and 42_1
    distance1 = np.sqrt((x41 - x42_1)**2 + (y41 - y42_1)**2)
    print("distance 41 - 42_1:   ", distance1)

    # Euclidean distance 42_1 and 42_2
    distance2 = np.sqrt((x42_1 - x42_2)**2 + (y42_1 - y42_2)**2)
    print("distance 42_1 - 42_2: ", distance2)

    if distance1 < distance2:
        print("DOĞRU")
    else:
        print("yanlış")