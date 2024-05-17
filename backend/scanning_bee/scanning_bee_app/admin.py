from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *

# Register your models here.
class CustomUserAdmin(BaseUserAdmin):
    ordering = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserType)
admin.site.register(Frame)
admin.site.register(Cell)
admin.site.register(Content)
admin.site.register(CellContent)