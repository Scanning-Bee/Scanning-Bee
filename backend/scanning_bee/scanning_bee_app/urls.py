from django.urls import path
from . import views

urlpatterns = [
    path('usertypes/', views.UserTypeList.as_view(), name='usertype-list'),

    path('usertypes/<int:id>/', views.SingleUserType.as_view(), name='usertype-detail'),

    path('users/', views.UserList.as_view(), name='user-list'),

    path('users/<int:id>/', views.SingleUser.as_view(), name='user-detail'),

    path('frames/', views.FrameList.as_view(), name='frame-list'),

    path('frames/<int:id>/', views.SingleFrame.as_view(), name='frame-detail'),


    path('cells/<int:id>/', views.SingleCell.as_view(), name='cell-detail'),

    path('cells/', views.CellList.as_view(), name='cell-list'),

    path('cells/by-location/', views.CellListByLocation.as_view(), name='cell-list-by-location'),

    path('contents/', views.ContentList.as_view(), name='content-list'),

    path('contents/<int:id>/', views.SingleContent.as_view(), name='content-detail'),
    path('cellcontents/<int:id>/', views.SingleCellContent.as_view(), name='cellcontent-detail'),

    path('cellcontents/', views.CellContentList.as_view(), name='cellcontent-list'),
    path('cellcontents/<str:filter_type>/<str:arg>/', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontents/<str:filter_type>/<str:x_pos>/<str:y_pos>/', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontents/ai/<str:image_name>/', views.CellContentList.as_view(), name='cellcontent-detail'),

    path('images/', views.ImageList.as_view(), name='image-details')
]

