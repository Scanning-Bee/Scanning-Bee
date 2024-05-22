from django.forms import ValidationError
from django.db import transaction
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view  # Import the api_view decorator
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .permissions import IsBiologOrSelf

from .models import *
from .serializers import *
from .real_world_coordiantes import get_index_from_real_world

from datetime import datetime, timezone

import sys
import os
import yaml
import logging

logger = logging.getLogger(__name__)


#sys.path.insert(0, '../../')

#from AI.test import classify_cell_states
#from AI.set_grid import *
from AI.test import classify_cell_states

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


class HomeView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        content = {'message': 'Welcome to Scanning Bee App :)'}
        return Response(content)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

##################### USER TYPE #####################


class UserTypeList(ListCreateAPIView):
    serializer_class = UserTypeSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = UserType.objects.all()
        pk = self.kwargs.get('id')
        if pk:
            queryset = queryset.filter(id=pk)
        return queryset


class UserTypeDetail(RetrieveUpdateDestroyAPIView):
    queryset = UserType.objects.all()
    serializer_class = UserTypeSerializer
    lookup_field = 'id'


##################### USER #####################
class UserRegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = get_user_model().objects.create_user(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password'],
                email=serializer.validated_data['email'],
                user_type=serializer.validated_data.get('user_type') 
            )
            refresh = RefreshToken.for_user(user)
            return Response({'refresh': str(refresh),
                             'access': str(refresh.access_token), "message": "User registered successfully.",
                             "user": str(user)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        password = request.data.get('password')

        user = authenticate(username=username, first_name=first_name, last_name=last_name, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
class UsernameById(APIView):
    def get(self, request, id):
        user = get_object_or_404(CustomUser, id=id)
        return Response({'username': user.username})

class UserList(ListCreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        if user.user_type.type == "Biolog":
            return CustomUser.objects.all()
        else:
            return CustomUser.objects.filter(username=user.username) if not CustomUser.objects.none() else []

    def get_permissions(self):
        if self.request.method == ['PUT', 'GET']:
            self.permission_classes = [IsAuthenticated, IsBiologOrSelf]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def put(self, request, *args, **kwargs):
        user = self.request.user
        username = self.kwargs.get('username')

        # Check if the username in the request is valid
        if not username:
            return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the user object to be updated
        obj = get_object_or_404(CustomUser, username=username)

        # Check permissions
        self.check_object_permissions(request, obj)

        serializer = CustomUserSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsBiologOrSelf]
    lookup_field = 'username'

    def retrieve(self, request, *args, **kwargs):
        username = self.kwargs.get('username')
        obj = get_object_or_404(CustomUser, username=username)

        # Check object permissions
        self.check_object_permissions(request, obj)

        serializer = CustomUserSerializer(obj)
        return Response(serializer.data)


##################### FRAME #####################

class FrameList(ListCreateAPIView):
    serializer_class = FrameSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        queryset = Frame.objects.all()
        pk = self.kwargs.get('id')
        if pk:
            queryset = queryset.filter(id=pk)
        return queryset


class FrameDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Frame.objects.all()
    serializer_class = FrameSerializer
    lookup_field = 'id'


##################### CELL #####################
class CellList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CellSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = Cell.objects.all()
        pk = self.kwargs.get('id')

        if pk:
            queryset = queryset.filter(id=pk)

        filter_type = self.kwargs.get('filter_type')

        if filter_type == 'location':
            i_index = self.kwargs.get('i_index', None)
            j_index = self.kwargs.get('j_index', None)

            if i_index is not None and j_index is not None:
                queryset = queryset.filter(i_index=i_index, j_index=j_index)
            else:
                return Response("i_index and j_index are required for location filter.", status=status.HTTP_400_BAD_REQUEST)

        return queryset


class CellDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Cell.objects.all()
    serializer_class = CellSerializer
    lookup_field = 'id'


##################### CONTENT #####################
class ContentList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ContentSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = Content.objects.all()
        pk = self.kwargs.get('id')
        if pk:
            queryset = queryset.filter(id=pk)
        return queryset


class ContentDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    lookup_field = 'id'


##################### CELL CONTENT #####################
class CellContentList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CellContentSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = CellContent.objects.all()
        pk = self.kwargs.get('id')

        if pk:
            queryset = queryset.filter(id=pk)

        filter_type = self.kwargs.get('filter_type')
        if filter_type == "image_name":
            image_name = self.kwargs.get('arg')
            image_list = Image.objects.filter(image_name=image_name)
            queryset = queryset.filter(image__in=image_list)


        elif filter_type == "location":
            x_pos = self.kwargs.get('x_pos')
            y_pos = self.kwargs.get('y_pos')
            timestamp = self.kwargs.get('timestamp')
            image_queryset = Image.objects.filter(x_pos=x_pos, y_pos=y_pos)

            if timestamp is not None:
                image_queryset = image_queryset.filter(timestamp=timestamp)

            image_list = list(image_queryset)
            queryset = queryset.filter(image__in=image_list)

        elif filter_type == "time_range":
            start_time = self.kwargs.get('start_time')
            end_time = self.kwargs.get('end_time', None)
            if end_time is None:
                end_time = datetime.now(timezone.utc)

            queryset = queryset.filter(timestamp__gte=start_time, timestamp__lte=end_time)

        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data

        if not isinstance(data, list):  # Check if request data is a list for bulk creation
            data = [data]

        created_instances = []  # To store the response data of created instances
        errors = []  # To accumulate any errors during creation

        with transaction.atomic():  # Ensure the operation is atomic
            for item_data in data:
                # if there is a user field update it, if not then add it
                if 'user' not in item_data:
                    item_data['user'] = request.user.id
                else:
                    item_data.update({'user': request.user.pk})

                # round center_x and center_y to the nearest integer
                item_data['center_x'] = round(item_data['center_x'])
                item_data['center_y'] = round(item_data['center_y'])
                
                serializer = self.get_serializer(data=item_data)
                # print('serializer', serializer)
                if serializer.is_valid():
                    # Create CellContent instance and link with Cell
                    cell_content_instance = serializer.save()  # Calls the custom save method
                    created_instances.append(serializer.data)  # Append the serialized data
                else:
                    # if the error is about unique set with code='unique', then ignore it
                    if 'unique' in str(serializer.errors):
                        continue
                    errors.append(serializer.errors)  # Accumulate errors

        if errors:
            # If there were any errors, roll back and return them
            print(f"\nErrors: {errors}\n")
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If all instances were created successfully, return their data
            return Response(created_instances, status=status.HTTP_201_CREATED)


class CellContentDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsBiologOrSelf]
    queryset = CellContent.objects.all()
    serializer_class = CellContentSerializer
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        username = self.kwargs.get('username')
        obj = get_object_or_404(CustomUser, username=username)

        # Check object permissions
        self.check_object_permissions(request, obj)

        cell_content_obj = get_object_or_404(CellContent, user=obj)
        serializer = CellContentSerializer(cell_content_obj)
        return Response(serializer.data)


class CellContentsByAI(ListCreateAPIView):
    serializer_class = CellContentSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request,  x_pos, y_pos, timestamp=None, format=None):
        queryset = Image.objects.filter(x_pos=x_pos, y_pos=y_pos)
        if timestamp is not None:
            queryset = queryset.filter(timestamp=timestamp)

        image_list = list(queryset)
        cell_contents = list()

        if len(image_list) > 1:
            print("image list is greater than 1")
        elif len(image_list) == 0:
            print("image list is 0")

        for image in image_list:
            # annotation folder is at the same level as the backend folder, but this file is in backend/scanning_bee/scanning_bee_app/views.py
            # image should be in the same folder as the annotation folder
            # from root folder of the project, annotation folders path: ./AnnotationFiles
            # image path should be: ./AnnotationFiles/ + image.image_name
            # this views.py files path is: ./backend/scanning_bee/scanning_bee_app/views.py

            bag = Bag.objects.get(pk=image.bag.id)
            bag_name = bag.name

            project_root = os.path.abspath(os.path.join(settings.BASE_DIR, "../../"))
            image_path = os.path.join(project_root, f"AnnotationFiles/{bag_name}/{image.image_name}")

            #print('image_path at views: ', image_path)

            all_detected_circles = classify_cell_states(image_path)

            # all detected circles is a dictionary of (x, y, radius): type

            frame = Frame.objects.get(pk=1)  # Assuming frame 1 for now

            # get the user info from the request
            user = request.user

            for pixel_coords, content in all_detected_circles.items():
                # Find which content in the database
                print(content)
                if content == "PUPPA":
                    content = "PUPA"
                
                try:
                    content = Content.objects.get(name=content)
                except Content.DoesNotExist:
                    print(f"SIKINTILI CONTENT: {content}")
                x, y, radius = pixel_coords
                cell_content = CellContent(cell=None, 
                                           frame=frame, 
                                           timestamp=None, 
                                           content=content, 
                                           user=user, 
                                           center_x=x, 
                                           center_y=y, 
                                           image=image, 
                                           radius=radius)
                cell_contents.append(cell_content)


        serializer = CellContentSerializer(cell_contents, many=True)
        return Response(serializer.data)

######################## IMAGE ##################################
class ImageList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ImageSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = Image.objects.all()
        pk = self.kwargs.get('id')

        if pk:
            queryset = queryset.filter(id=pk)
        filter_type = self.kwargs.get('filter_type')

        if filter_type == 'location':
            x_pos = self.kwargs.get('x_pos')
            y_pos = self.kwargs.get('y_pos')
            timestamp = self.kwargs.get('timestamp')
            queryset = queryset.filter(x_pos=x_pos, y_pos=y_pos)

            if timestamp is not None:
                queryset = queryset.filter(timestamp=timestamp)

        elif filter_type == 'name':
            name = self.kwargs.get('name')
            queryset = queryset.filter(name=name)

        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Handle bag name
        bag_name = data.pop('bag', None)
        if bag_name:
            bag, created = Bag.objects.get_or_create(name=bag_name)
            data['bag'] = bag.id

        try:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(f"\nError: {e}\n")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        # Customize the save operation here if needed
        serializer.save()


class ImageDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        id = self.kwargs.get('id')
        if id == "all":
            Image.objects.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return super().delete(request, *args, **kwargs)


class ImageScraper(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ImageSerializer

    def post(self, request, *args, **kwargs):
        # Use 'path' from request data as an absolute path
        relative_path = request.data.get('path')
        if not relative_path:
            return Response({"error": "Path parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        # if not os.path.isabs(relative_path):
        #     return Response({"error": "The provided path is not an absolute path."}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"Current Working Directory: {os.getcwd()}")
        print(f"Looking for metadata.yaml at: {relative_path}")

        # Verify if the file exists before attempting to open it
        if not os.path.exists(relative_path):
            return Response({"error": f"Metadata file not found at the provided path: {relative_path}"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            metadata_path = os.path.join(relative_path, 'metadata.yaml')

            with open(metadata_path, 'r') as file:
                metadata = yaml.safe_load(file)
            
            bag_name = metadata.get('images', {}).get('bag_name', None)
            if not bag_name:
                return Response({"error": "Bag name is missing in metadata."}, status=status.HTTP_400_BAD_REQUEST)
            
            bag, created = Bag.objects.get_or_create(name=bag_name)
            
            image_data_list = metadata.get('images', {}).get('image_data', [])
            created_images = []

            for i, item in enumerate(image_data_list):
                if i < len(image_data_list) - 1:
                    image_name = image_data_list[i + 1]['prev_image']
                else:
                    image_name = "final_image.jpg"  # Adjust as necessary

                timestamp = datetime.fromtimestamp(item['sec'], tz=timezone.utc)
                image_instance_data = {
                    'image_name': image_name,
                    'x_pos': item.get('x_pos'),
                    'y_pos': item.get('y_pos'),
                    'timestamp': timestamp,
                    'bag': bag.id
                }

                # Check if an image with these properties already exists
                existing_image = Image.objects.filter(
                    x_pos=image_instance_data['x_pos'],
                    y_pos=image_instance_data['y_pos'],
                    timestamp=image_instance_data['timestamp'],
                ).first()

                if existing_image:
                    # If the image already exists, append its data to the response but do not create a new one
                    serializer = self.get_serializer(existing_image)
                    # created_images.append(serializer.data)
                else:
                    # If the image does not exist, proceed with creation
                    serializer = self.get_serializer(data=image_instance_data)
                    if serializer.is_valid():
                        serializer.save()
                        created_images.append(serializer.data)
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            
            return Response({"created_images": created_images}, status=status.HTTP_201_CREATED)
        
        except FileNotFoundError:
            logger.error(f"Metadata file not found at: {metadata_path}")
            return JsonResponse({"error": f"Metadata file not found at the provided path: {metadata_path}"}, status=404)
        except PermissionError:
            logger.error(f"Permission denied for file at: {metadata_path}")
            return JsonResponse({"error": "Permission denied for accessing the file."}, status=403)
        except Exception as e:
            logger.error(f"Unexpected error accessing file at {metadata_path}: {e}")
            return JsonResponse({"error": str(e)}, status=500)
        

######################## BAG ##################################
class BagList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BagSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = Bag.objects.all()
        pk = self.kwargs.get('id')

        if pk:
            queryset = queryset.filter(id=pk)

        return queryset


class BagDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Bag.objects.all()
    serializer_class = BagSerializer
    lookup_field = 'id'


######################## DELETE ALL ##################################
class DeleteAll(APIView):
    def delete(self, request, *args, **kwargs):
        CellContent.objects.all().delete()
        User.objects.all().delete()
        UserType.objects.all().delete()
        Frame.objects.all().delete()
        Cell.objects.all().delete()
        Content.objects.all().delete()
        Image.objects.all().delete()
        Bag.objects.all().delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
