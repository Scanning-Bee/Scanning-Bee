from django.db import models
#from django.contrib.gis.db import models as geo_models
from .real_world_coordiantes import convert_to_world_coordinates

CELL_LOC_THRESHOLD = 0.01


class UserType(models.Model):
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.type


class User(models.Model):
    name = models.CharField(max_length=100)
    user_type = models.ForeignKey(UserType, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return str(self.pk) + " - " + self.user_type.description


class Frame(models.Model):
    description = models.CharField(max_length=100, null=True)

    def __str__(self):
        return str(self.pk) + " - " + self.description


class Cell(models.Model):
    location_on_frame_x = models.FloatField()
    location_on_frame_y = models.FloatField()
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.pk) + " - (" + str(self.location_on_frame_x) + ", " + str(self.location_on_frame_y) + ")"


class Content(models.Model):
    name = models.CharField(max_length=100)
    content_description = models.TextField()
    
    def __str__(self):
        return self.name


class Image(models.Model):
    image_name = models.CharField(max_length=100)
    x_pos = models.FloatField()
    y_pos = models.FloatField()


class CellContent(models.Model):
    cell = models.ForeignKey(Cell, on_delete=models.PROTECT, null=True)
    frame = models.ForeignKey(Frame, on_delete=models.PROTECT, default=1)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)
    content = models.ForeignKey(Content, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    center_x = models.IntegerField()
    center_y = models.IntegerField()
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    radius = models.IntegerField()

    def __str__(self):
        return str(self.pk) + " - " + self.content.name + " - " + str(self.cell)

    def save(self, *args, **kwargs):
        my_image = Image.objects.get(pk = self.image.pk)
        x_pos = my_image.x_pos
        y_pos = my_image.y_pos

        calculated_x, calculated_y = convert_to_world_coordinates(self.center_x, self.center_y, x_pos, y_pos)

        cell = self.find_or_create_cell(calculated_x, calculated_y, self.frame)
        self.cell = cell

        super(CellContent, self).save(*args, **kwargs)

    def find_or_create_cell(self, calculated_x, calculated_y, frame):
        threshold = CELL_LOC_THRESHOLD
        cells = Cell.objects.filter(
            frame=frame,
            location_on_frame_x__gte=calculated_x - threshold,
            location_on_frame_x__lte=calculated_x + threshold,
            location_on_frame_y__gte=calculated_y - threshold,
            location_on_frame_y__lte=calculated_y + threshold
        )

        if cells.exists():
            return cells.first()
        else:
            new_cell = Cell(
                location_on_frame_x=calculated_x,
                location_on_frame_y=calculated_y,
                frame=frame
            )
            new_cell.save()
            return new_cell

