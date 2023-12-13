import numpy as np
import cv2
import pandas as pd

camera_info_file_path = 'backend/scanning_bee/scanning_bee_app/camera_info.csv'
camera_info = pd.read_csv(camera_info_file_path)

D_values = camera_info.filter(like='field.D').iloc[0].values
K_values = camera_info.filter(like='field.K').iloc[0].values


# the distortion coefficients array
D = np.array(D_values)

# the intrinsic matrix
K = np.array(K_values).reshape((3, 3))

def project_point(point_3d, K, D):
    """
    Projects a 3D point to 2D using the camera intrinsic matrix and distortion coefficients.

    point_3d: A 3D point in the camera's coordinate frame (numpy array or list)
    K: The intrinsic camera matrix
    D: The distortion coefficients
    """

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

    point_2d: The 2D point in image coordinates (numpy array or list)
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
    real_world_x = normalized_x * depth
    real_world_y = normalized_y * depth
    real_world_z = depth

    return np.array([real_world_x, real_world_y, real_world_z])



# Test the functions
point_3d = [0, 0, 5]
point_2d = project_point(point_3d, K, D)
print("Projected 2D point:", point_2d)

depth = 5
real_world_coordinates = find_real_world_coordinates(point_2d, depth, K, D)
print("Real-world coordinates:", real_world_coordinates)
