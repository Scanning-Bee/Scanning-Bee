from django.urls.converters import StringConverter
from datetime import datetime


class DateTimeConverter(StringConverter):
    regex = '\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}'

    def to_python(self, value):
        return datetime.strptime(value, '%Y-%m-%d_%H-%M-%S')

    def to_url(self, value):
        return value.strftime('%Y-%m-%d_%H-%M-%S')


class FloatConverter(StringConverter):
    regex = '[+-]?([0-9]*[.])?[0-9]+'

    def to_python(self, value):
        return float(value)

    def to_url(self, value):
        return str(value)
