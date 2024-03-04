from django.urls import path, register_converter
from . import views
from .converters import FloatConverter, DateTimeConverter

register_converter(FloatConverter, 'float')
register_converter(DateTimeConverter, 'datetime')

urlpatterns = [
    path('user_type_list', views.UserTypeList.as_view(), name='usertype-list'),
    path('user_type_list/<int:id>', views.UserTypeList.as_view(), name='usertype-list'),

    path('user_type_detail/<int:id>', views.UserTypeDetail.as_view(), name='usertype-detail'),

    path('user_list', views.UserList.as_view(), name='user-list'),
    path('user_list/<int:id>', views.UserList.as_view(), name='user-list'),

    path('user_detail/<int:id>', views.UserDetail.as_view(), name='user-detail'),

    path('frame_list', views.FrameList.as_view(), name='frame-list'),
    path('frame_list/<int:id>', views.FrameList.as_view(), name='frame-list'),

    path('frame_detail/<int:id>', views.FrameDetail.as_view(), name='frame-detail'),

    path('cell_list', views.CellList.as_view(), name='cell-list'),
    path('cell_list/<int:id>', views.CellList.as_view(), name='cell-list'),
    path('cell_list/<str:filter_type>/<float:location_on_frame_x>/<float:location_on_frame_y>', views.CellList.as_view(), name='cell-list'),

    path('cell_detail/<int:id>', views.CellDetail.as_view(), name='cell-detail'),

    path('content_list', views.ContentList.as_view(), name='content-list'),
    path('content_list/<int:id>', views.ContentList.as_view(), name='content-list'),

    path('content_detail/<int:id>', views.ContentDetail.as_view(), name='content-detail'),

    path('cellcontent_list', views.CellContentList.as_view(), name='cellcontent-list'),
    path('cellcontent_list/<int:id>', views.CellContentList.as_view(), name='cellcontent-list'),
    path('cellcontent_list/<str:filter_type>/<str:arg>', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontent_list/<str:filter_type>/<float:x_pos>/<float:y_pos>', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontent_list/<str:filter_type>/<float:x_pos>/<float:y_pos>/<datetime:timestamp>', views.CellContentList.as_view(), name='cellcontent-detail'),

    path('cellcontent_detail/<int:id>', views.CellContentDetail.as_view(), name='cellcontent-detail'),

    path('cellcontentsbyai/<float:x_pos>/<float:y_pos>', views.CellContentsByAI.as_view(), name='cellcontent-detail'),
    path('cellcontentsbyai/<float:x_pos>/<float:y_pos>/<datetime:timestamp>', views.CellContentsByAI.as_view(), name='cellcontent-detail'),

    path('image_list', views.ImageList.as_view(), name='image-details'),
    path('image_list/<int:id>', views.ImageList.as_view(), name='image-details'),
    path('image_list/<str:filter_type>/<str:name>', views.ImageList.as_view(), name='image-details'),
    path('image_list/<str:filter_type>/<float:x_pos>/<float:y_pos>', views.ImageList.as_view(), name='image-details'),
    path('image_list/<str:filter_type>/<float:x_pos>/<float:y_pos>/<datetime:timestamp>', views.ImageList.as_view(), name='image-details'),

    path('image_detail/<int:id>', views.ImageDetail.as_view(), name='image-details'),
]

