from rest_framework import serializers
from course_api.models import *

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        extra_kwargs = {'name': {'required': False}, 'tags': {'required': False}, 'description': {'required': False}, 'target_audience': {'required': False}, 'outline': {'required': False}, 'outcome': {'required': False}, 'instructor': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        course = Course(
            name=validated_data['name'],
            description=validated_data['description'],
            target_audience=validated_data['target_audience'],
            outline=validated_data['outline'],
            outcome=validated_data['outcome'],
            instructor=validated_data['instructor'],
            tags=validated_data['tags'],
        )
        course.save()
        return course

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'
        depth = 1
    
    def create(self, validated_data):
        chapter = Chapter(
            name=validated_data['name'],
            description=validated_data['description'],
            course=validated_data['course'],
        )
        chapter.save()
        return chapter

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
        depth = 1
    
    def create(self, validated_data):
        video = Video(
            name=validated_data['name'],
            description=validated_data['description'],
            chapter=validated_data['chapter'],
        )
        video.save()
        return video