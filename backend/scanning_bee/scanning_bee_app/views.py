from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view  # Import the api_view decorator
from rest_framework import status
from .models import Cell, CellContent
from .serializers import CellSerializer, CellContentSerializer

@api_view(['GET', 'POST'])
def cellList(request):
    if request.method == 'GET':
        cells = Cell.objects.all()
        serializer = CellSerializer(cells, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CellSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
def cellContentList(request):
    if request.method == 'GET':
        cellContents = CellContent.objects.all()
        serializer = CellContentSerializer(cellContents, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CellContentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)