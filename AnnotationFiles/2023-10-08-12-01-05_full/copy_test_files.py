# copy files with names image_<number>.jpg where number is divisible by 25 to test_images folder

import os
import shutil

def copy_test_images():
    # Create a folder to store the test images
    if not os.path.exists('test_images'):
        os.makedirs('test_images')

    # Get the list of files in the current directory
    files = os.listdir()

    # Copy the files with names image_<number>.jpg where number is divisible by 25 to test_images folder
    for file in files:
        if file.startswith('image_') and file.endswith('.jpg'):
            number = int(file.split('_')[1].split('.')[0])
            if number % 25 == 0:
                shutil.copy(file, 'test_images')
                print(f'Copied {file} to test_images folder')

    print('Done copying files')

def group_files(group_by=70, folder_name="test_images"):
    #group the images in the folder by 70 images and print the each groups first image and last image
    files = os.listdir(folder_name)
    files.sort()
    group = []
    print(f'Total files: {len(files)}')
    for i, file in enumerate(files):
        group.append(file)
        if (i+1) % group_by == 0:
            print(f'Group {i//group_by+1}: {group[0]} to {group[-1]}')
            group = []


if __name__ == '__main__':
    #copy_test_images()
    group_files()