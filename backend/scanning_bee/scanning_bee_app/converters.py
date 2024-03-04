from django.urls.converters import StringConverter
from datetime import datetime


class DateTimeConverter:
    # The regex for matching the URL path segment
    regex = r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}Z'

    def to_python(self, value):
        # Convert the matched string to a Python datetime object
        return datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%fZ')

    def to_url(self, value):
        # Convert a Python datetime object to a string format for the URL
        return value.strftime('%Y-%m-%dT%H:%M:%S.%fZ')


class FloatConverter(StringConverter):
    regex = '[+-]?([0-9]*[.])?[0-9]+'

    def to_python(self, value):
        return float(value)

    def to_url(self, value):
        return str(value)
