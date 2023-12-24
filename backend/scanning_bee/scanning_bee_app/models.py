from django.db import models
from django.contrib.gis.db import models as geo_models


class UserType(models.Model):
    description = models.CharField(max_length=100)

    def __str__(self):
        return self.description


class User(models.Model):
    user_type = models.ForeignKey(UserType, on_delete=models.PROTECT, null=True)


class Frame(models.Model):
    pass


class Cell(models.Model):
    location_on_frame_x = models.FloatField()
    location_on_frame_y = models.FloatField()
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)


class Content(models.Model):
    name = models.CharField(max_length=100)
    content_description = models.TextField()
    
    def __str__(self):
        return self.name


class CellContent(models.Model):
    cell = models.ForeignKey(Cell, on_delete=models.PROTECT)
    timestamp = models.DateTimeField()
    content = models.ForeignKey(Content, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    center_x = models.IntegerField()
    center_y = models.IntegerField()
    radius = models.IntegerField()
    image_name = models.CharField(max_length=100)
