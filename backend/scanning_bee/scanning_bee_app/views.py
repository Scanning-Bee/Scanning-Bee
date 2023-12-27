from django.forms import ValidationError
from django.db import transaction
from rest_framework.response import Response
from rest_framework.decorators import api_view  # Import the api_view decorator
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework import status

from .models import *
from .serializers import *
from .real_world_coordiantes import convert_to_world_coordinates

import sys
sys.path.insert(0, '../../')

from AI.test import test_lines


##################### USER TYPE #####################
class UserTypeList(ListCreateAPIView):
    queryset = UserType.objects.all()
    serializer_class = UserTypeSerializer


class SingleUserType(RetrieveUpdateDestroyAPIView):
    queryset = UserType.objects.all()
    serializer_class = UserTypeSerializer
    lookup_field = 'id'


##################### USER #####################
class UserList(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SingleUser(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'


##################### FRAME #####################
class FrameList(ListCreateAPIView):
    queryset = Frame.objects.all()
    serializer_class = FrameSerializer


class SingleFrame(RetrieveUpdateDestroyAPIView):
    queryset = Frame.objects.all()
    serializer_class = FrameSerializer
    lookup_field = 'id'


##################### CELL #####################
class CellList(ListCreateAPIView):
    queryset = Cell.objects.all()
    serializer_class = CellSerializer


class CellListByLocation(ListCreateAPIView):
    serializer_class = CellSerializer
    threshold = CELL_LOC_THRESHOLD

    def get_queryset(self):
        queryset = Cell.objects.all()
        location_on_frame_x = self.request.query_params.get('location_on_frame_x', None)
        location_on_frame_y = self.request.query_params.get('location_on_frame_y', None)

        if location_on_frame_x is not None and location_on_frame_y is not None:
            try:
                # Convert parameters to float and validate
                location_on_frame_x = float(location_on_frame_x)
                location_on_frame_y = float(location_on_frame_y)

                # Calculate the range for x and y based on the threshold
                x_min, x_max = location_on_frame_x - self.threshold, location_on_frame_x + self.threshold
                y_min, y_max = location_on_frame_y - self.threshold, location_on_frame_y + self.threshold

                # Filter the queryset within the range for both x and y
                queryset = queryset.filter(
                    location_on_frame_x__gte=x_min, location_on_frame_x__lte=x_max,
                    location_on_frame_y__gte=y_min, location_on_frame_y__lte=y_max
                )
            except ValueError:
                # Handle cases where the conversion fails
                raise ValidationError(
                    "Invalid parameters: Ensure 'location_on_frame_x' and 'location_on_frame_y' are valid numbers.")

        return queryset


class SingleCell(RetrieveUpdateDestroyAPIView):
    queryset = Cell.objects.all()
    serializer_class = CellSerializer
    lookup_field = 'id'


##################### CONTENT #####################
class ContentList(ListCreateAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer


class SingleContent(RetrieveUpdateDestroyAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    lookup_field = 'id'


##################### CELL CONTENT #####################
class CellContentList(ListCreateAPIView):
    serializer_class = CellContentSerializer

    def get_queryset(self):
        queryset = CellContent.objects.all()
        filter_type = self.kwargs.get('filter_type')

        if filter_type == "image_name":
            image_name = self.kwargs.get('arg')
            image = Image.objects.filter(image_name=image_name)
            queryset = queryset.filter(image=image.pk)

        elif filter_type == "image_name_rect":
            image_name = self.kwargs.get('arg')
            image = Image.objects.get(image_name=image_name)
            min_x, min_y = convert_to_world_coordinates((0, 0), image.x_pos, image.y_pos)
            max_x, max_y = convert_to_world_coordinates((1920, 1080), image.x_pos, image.y_pos)

            cells = Cell.objects.filter(
                frame=1,
                location_on_frame_x__gte=min_x,
                location_on_frame_x__lte=max_x,
                location_on_frame_y__gte=min_y,
                location_on_frame_y__lte=max_y
            )

            if cells.exists():
                queryset = queryset.filter(cell__in=cells)

            else:
                queryset = queryset.none()
        
        elif filter_type == "ai":
            image_name = self.kwargs.get('arg')
            all_detected_circles = test_lines("scanning_bee_app/AnnotationFiles/" + image_name)
            image = Image.objects.filter(image_name=image_name)
            cell_contents = list()
            for circle in all_detected_circles:
                x = circle[0]
                y = circle[1]
                radius = circle[2]
                cell_content = CellContent(cell=None,
                                        frame=1,
                                        timestamp=None,
                                        content=9,
                                        user=1,
                                        center_x=x,
                                        center_y=y,
                                        image=image.pk,
                                        radius=radius)
                cell_contents.append(cell_content)

            return Response(30)

        return queryset

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):  # Check if request is a list for bulk creation
            created_instances = []  # To store the response data of created instances
            errors = []  # To accumulate any errors during creation

            with transaction.atomic():  # Ensure the operation is atomic
                for item_data in request.data:
                    serializer = self.get_serializer(data=item_data)
                    if serializer.is_valid():
                        # Create CellContent instance and link with Cell
                        cell_content_instance = serializer.save()  # Calls the custom save method
                        created_instances.append(serializer.data)  # Append the serialized data
                    else:
                        errors.append(serializer.errors)  # Accumulate errors

            if errors:
                # If there were any errors, roll back and return them
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # If all instances were created successfully, return their data
                return Response(created_instances, status=status.HTTP_201_CREATED)

        else:  # Fallback to original create method for single creations
            return super().create(request, *args, **kwargs)


class SingleCellContent(RetrieveUpdateDestroyAPIView):
    queryset = CellContent.objects.all()
    serializer_class = CellContentSerializer
    lookup_field = 'id'


class CellContentsByAI(ListCreateAPIView):
    serializer_class = CellContentSerializer

    def get_queryset(self):
        print("ZOOOOOOORT")
        queryset = CellContent.objects.all()
        image_name = self.kwargs.get('image_name')
        image = Image.objects.filter(image_name=image_name)
        queryset = queryset.filter(image=image.pk)
        return queryset

    # def get(self, request, image_name, format=None):
    #     print(request.data)
    #     print("ZOOOOOOORT")
    
    #     all_detected_circles = test_lines("backend/scanning_bee/scanning_bee_app/AnnotationFiles/" + image_name)
    #     image = Image.objects.filter(image_name=image_name)
    #     cell_contents = list()
    #     for circle in all_detected_circles:
    #         x = circle[0]
    #         y = circle[1]
    #         radius = circle[2]
    #         cell_content = CellContent(cell=None,
    #                                   frame=1,
    #                                   timestamp=None,
    #                                   content=9,
    #                                   user=1,
    #                                   center_x=x,
    #                                   center_y=y,
    #                                   image=image.pk,
    #                                   radius=radius)
    #         cell_contents.append(cell_content)

    #     return Response(30)


class ImageList(ListCreateAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
