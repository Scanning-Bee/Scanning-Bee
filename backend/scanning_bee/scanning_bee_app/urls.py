from django.urls import path
from .views import CellListView, CellContentView

from . import views

urlpatterns = [
    path('cells/', CellListView.as_view(), name='cell-list'),
    path('cell-contents/', CellContentView.as_view(), name='cell-content-list'),
]

