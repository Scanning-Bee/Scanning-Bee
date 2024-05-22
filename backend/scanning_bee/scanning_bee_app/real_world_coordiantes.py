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

    return (real_world_x, real_world_y)


def get_index_from_coordinate(real_world_x, real_world_y):
        i = round((real_world_x - 0.04914692) / 0.00528934)
        j = round((real_world_y - 0.00362747) / 0.00346662)

def get_index_from_real_world(x_pos_norm, y_pos_norm, z_distance, points_2d, camera_info_path="scanning_bee_app/camera_info.csv"):
    real_world_x, real_world_y = real_world_alternative(x_pos_norm, y_pos_norm, z_distance, points_2d, camera_info_path)
    return get_index_from_coordinate(real_world_x, real_world_y)

