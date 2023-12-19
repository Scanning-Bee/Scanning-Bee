from django.db import models
from django.utils import timezone


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class AbstractBaseModel(models.Model):
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_when = models.DateTimeField(null=True, blank=True)
    created_when = models.DateTimeField(default=timezone.now, null=True)
    modified_when = models.DateTimeField(default=timezone.now, null=True)
    # raw_version
    # modified_when -> last_updated ?

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.deleted_when = timezone.now()
        self.save()

    def save(self, *args, **kwargs):
        # if self.pk is not None:
        #    self.modified_when = timezone.now()
        super(AbstractBaseModel, self).save(*args, **kwargs)




class UserType(AbstractBaseModel):
    description = models.CharField(max_length=100)


class User(AbstractBaseModel):
    user_type = models.ForeignKey(UserType, on_delete=models.PROTECT, null=True)


class Frame(AbstractBaseModel):
    pass


class Cell(AbstractBaseModel):
    location_on_frame_x = models.FloatField()
    location_on_frame_y = models.FloatField()
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE)


class Content(AbstractBaseModel):
    name = models.CharField(max_length=100)
    content_description = models.TextField()


class CellContent(AbstractBaseModel):
    cell = models.ForeignKey(Cell, on_delete=models.PROTECT)
    timestamp = models.DateTimeField()
    content = models.ForeignKey(Content, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    center_x = models.IntegerField()
    center_y = models.IntegerField()
    radius = models.IntegerField()
    image_name = models.CharField(max_length=100)
    x_pos = models.FloatField()
    y_pos = models.FloatField()


