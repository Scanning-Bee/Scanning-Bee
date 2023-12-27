import numpy as np
import cv2
import pandas as pd


def get_camera_info(camera_info_file_path="scanning_bee_app/camera_info.csv"):
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


def convert_to_world_coordinates(point_2d, x_pos, y_pos, Z=1, camera_info_path="scanning_bee_app/camera_info.csv"):
    """
    Converts a 2D point in image coordinates to 3D world coordinates using the camera's calibration data.

    :param point_2d: A tuple or list with the x, y coordinates of the point in the image.
    :param K: Intrinsic matrix of the camera.
    :param D: Distortion coefficients of the camera.
    :param x_pos: The x position of the camera in world coordinates.
    :param y_pos: The y position of the camera in world coordinates.
    :param Z: Assumed depth for the 3D point. Defaults to 1.
    :return: Numpy array representing the 3D point in world coordinates.
    """
    K, D = get_camera_info(camera_info_path)

    # Ensure the point is in the correct shape for cv2.undistortPoints
    point_2d = np.array(point_2d, dtype='float64').reshape(1, 1, 2)
    
    # Correct for distortion and convert to normalized camera coordinates
    undistorted_normalized = cv2.undistortPoints(point_2d, K, D, None, K)

    # Convert the normalized point to homogeneous coordinates
    point_normalized_homogeneous = np.array([undistorted_normalized[0][0][0], undistorted_normalized[0][0][1], 1])
    
    # Apply the camera's position as translation
    world_point = np.dot(np.linalg.inv(K), point_normalized_homogeneous) * Z
    world_point[0] += x_pos
    world_point[1] += y_pos

    return world_point[0], world_point[1]

