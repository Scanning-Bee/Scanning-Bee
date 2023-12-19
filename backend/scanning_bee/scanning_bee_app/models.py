from django.db import models
from django.contrib.gis.db import models as geo_models


class UserType(models.Model):
    description = models.CharField(max_length=100)


class User(models.Model):
    user_type = models.ForeignKey(UserType, on_delete=models.PROTECT, null=True)


class Frame(models.Model):
    pass


class Cell(models.Model):
    location_on_frame = geo_models.MultiPointField(dim=3)
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)


class Content(models.Model):
    name = models.CharField(max_length=100)
    content_description = models.TextField()


class CellContent(models.Model):
    cell = models.ForeignKey(Cell, on_delete=models.PROTECT)
    timestamp = models.DateTimeField()
    content = models.ForeignKey(Content, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
