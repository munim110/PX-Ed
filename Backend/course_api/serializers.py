from rest_framework import serializers
from course_api.models import *

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        extra_kwargs = {'name': {'required': False}, 'tags': {'required': False}, 'description': {'required': False}, 'target_audience': {'required': False}, 'outline': {'required': False}, 'outcome': {'required': False}, 'instructor': {'required': False}}
        depth = 1

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'
        depth = 1

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
        depth = 1