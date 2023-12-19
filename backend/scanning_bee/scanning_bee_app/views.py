from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Cell, CellContent
from .serializers import CellSerializer, CellContentSerializer


class CellListView(APIView):
    def get(self, request):
        cells = Cell.objects.all()
        serializer = CellSerializer(cells, many=True)
        return Response(serializer.data)


class CellContentView(APIView):
    def get(self, request):
        cell_contents = CellContent.objects.all()
        serializer = CellContentSerializer(cell_contents, many=True)
        return Response(serializer.data)
