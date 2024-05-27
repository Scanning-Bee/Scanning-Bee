from rest_framework.permissions import BasePermission

class IsBiologOrSelf(BasePermission):
    def has_permission(self, request, view):
        # Permission logic for list and create actions
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Permission logic for retrieve, update, and destroy actions
        if request.user.user_type.type == "Biolog":
            return True
        return obj.username == request.user.username
    
class IsBiolog(BasePermission):
    def has_permission(self, request, view):
        # Permission logic for list and create actions
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Permission logic for retrieve, update, and destroy actions
        return request.user.user_type.type == "Biolog"
