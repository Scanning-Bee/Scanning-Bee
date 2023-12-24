from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(UserType)
admin.site.register(User)
admin.site.register(Frame)
admin.site.register(Cell)
admin.site.register(Content)
admin.site.register(CellContent)