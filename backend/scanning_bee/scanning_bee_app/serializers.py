from rest_framework import serializers
from .models import Cell, CellContent


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cell
        fields = ['__all__']


class CellContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CellContent
        fields = ['__all__']
