from rest_framework import serializers
from .models import *


class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserType
        fields = '__all__'



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'user_type', 'annotation_count']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)
    
class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frame
        fields = '__all__'


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cell
        fields = '__all__'


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = '__all__'


class CellContentSerializer(serializers.ModelSerializer):
    cell_indices = serializers.SerializerMethodField()

    class Meta:
        model = CellContent
        fields = [field.name for field in CellContent._meta.fields if field.name != 'cell']  # Include all fields except 'cell'
        fields.append('cell_indices')

    def get_cell_indices(self, obj):
        return (obj.cell.i_index, obj.cell.j_index) if obj.cell else None


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

class BagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bag
        fields = '__all__'
