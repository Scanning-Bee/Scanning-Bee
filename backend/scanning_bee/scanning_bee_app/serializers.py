from rest_framework import serializers
from .models import Cell, CellContent


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cell
        fields = ['location_on_frame_x', 'location_on_frame_y', 'frame']


class CellContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CellContent
        fields = ['cell', 'timestamp', 'content', 'user', 'center_x', 'center_y', 'radius', 'image_name']
