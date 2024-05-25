from django.urls import path, register_converter
from . import views
from .converters import FloatConverter, DateTimeConverter

register_converter(FloatConverter, 'float')
register_converter(DateTimeConverter, 'datetime')

urlpatterns = [
    path('home', views.HomeView.as_view(), name ='home'),
    path('logout', views.LogoutView.as_view(), name ='logout'),
    path('register', views.UserRegistrationView.as_view(), name='register'),
    path('login', views.UserLoginView.as_view(), name='login'),

    path('user_type_list', views.UserTypeList.as_view(), name='usertype-list'),
    path('user_type_list/<int:id>', views.UserTypeList.as_view(), name='usertype-list'),

    path('user_type_detail/<int:id>', views.UserTypeDetail.as_view(), name='usertype-detail'),

    path('user_list', views.UserList.as_view(), name='user-list'),
    path('user_list/<int:id>', views.UserList.as_view(), name='user-list'),

    path('user_list/<str:username>', views.UserList.as_view(), name='user-list'),
    path('usernameById/<int:id>', views.UsernameById.as_view(), name='usernameById'),
    path('getactiveuser', views.GetActiveUser.as_view(), name='getactiveuser '),

    path('user_detail/<int:id>', views.UserDetail.as_view(), name='user-detail'),
    path('user_detail/<str:username>', views.UserDetail.as_view(), name='user-detail'),

    path('frame_list', views.FrameList.as_view(), name='frame-list'),
    path('frame_list/<int:id>', views.FrameList.as_view(), name='frame-list'),

    path('frame_detail/<int:id>', views.FrameDetail.as_view(), name='frame-detail'),

    path('cell_list', views.CellList.as_view(), name='cell-list'),
    path('cell_list/<int:id>', views.CellList.as_view(), name='cell-list'),
    path('cell_list/<str:filter_type>/<float:i_index>/<float:j_index>', views.CellList.as_view(), name='cell-list'),

    path('cell_detail/<int:id>', views.CellDetail.as_view(), name='cell-detail'),

    path('content_list', views.ContentList.as_view(), name='content-list'),
    path('content_list/<int:id>', views.ContentList.as_view(), name='content-list'),

    path('content_detail/<int:id>', views.ContentDetail.as_view(), name='content-detail'),

    path('cellcontent_list', views.CellContentList.as_view(), name='cellcontent-list'),
    path('cellcontent_list/<int:id>', views.CellContentList.as_view(), name='cellcontent-list'),
    path('cellcontent_list/<str:filter_type>/<str:arg>', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontent_list/<str:filter_type>/<float:x_pos>/<float:y_pos>', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontent_list/<str:filter_type>/<float:x_pos>/<float:y_pos>/<datetime:timestamp>', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontent_list/<str:filter_type>/<datetime:start_time>/<datetime:end_time>', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontent_list/<str:filter_type>/<datetime:start_time>', views.CellContentList.as_view(), name='cellcontent-detail'),
    path('cellcontent_list/<str:filter_type>', views.CellContentList.as_view(), name='cellcontent-detail'),

    path('cellcontent_detail/<int:id>', views.CellContentDetail.as_view(), name='cellcontent-detail'),
    path('cellcontent_detail/<str:username>', views.CellContentDetail.as_view(), name='cellcontent-detail'),

    path('cellcontentsbyai/<float:x_pos>/<float:y_pos>', views.CellContentsByAI.as_view(), name='cellcontent-detail'),
    path('cellcontentsbyai/<float:x_pos>/<float:y_pos>/<datetime:timestamp>', views.CellContentsByAI.as_view(), name='cellcontent-detail'),

    path('image_list', views.ImageList.as_view(), name='image-details'),
    path('image_list/<int:id>', views.ImageList.as_view(), name='image-details'),
    path('image_list/<str:filter_type>/<str:name>', views.ImageList.as_view(), name='image-details'),
    path('image_list/<str:filter_type>/<float:x_pos>/<float:y_pos>', views.ImageList.as_view(), name='image-details'),
    path('image_list/<str:filter_type>/<float:x_pos>/<float:y_pos>/<datetime:timestamp>', views.ImageList.as_view(), name='image-details'),

    path('image_detail/<int:id>', views.ImageDetail.as_view(), name='image-details'),
    path('image_detail/<str:id>', views.ImageDetail.as_view(), name='image-details'),

    path('image_scaper', views.ImageScraper.as_view(), name='image-scraper'),

    path('bag_list', views.BagList.as_view(), name='bag-list'),
    path('bag_list/<int:id>', views.BagList.as_view(), name='bag-list'),

    path('bag_detail/<int:id>', views.BagDetail.as_view(), name='bag-detail'),

    path('delete_all', views.DeleteAll.as_view(), name='delete-all'),
]

