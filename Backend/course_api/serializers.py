import outcome
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
        extra_kwargs = {'name': {'required': False}, 'description': {'required': False}, 'course': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        chapter = Chapter(
            name=validated_data['name'],
            description=validated_data['description'],
            course= Course.objects.get(id=int(validated_data['course'])),
            outcome = validated_data['outcomes'],
        )
        chapter.save()
        return chapter

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
        extra_kwargs = {'name': {'required': False}, 'description': {'required': False}, 'chapter': {'required': False}, 'video_url': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        video = Video(
            name=validated_data['name'],
            description=validated_data['description'],
            chapter= Chapter.objects.get(id=int(validated_data['chapter'])),
        )
        video.save()
        return video


class VideoCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoComment
        fields = '__all__'
        extra_kwargs = {'comment': {'required': False}, 'video': {'required': False}, 'user': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        video_comment = VideoComment(
            comment=validated_data['comment'],
            video= Video.objects.get(id=int(validated_data['video'])),
            user= SiteUser.objects.get(id=int(validated_data['user'])),
        )
        video_comment.save()
        return video_comment


class isWatchedSerializer(serializers.ModelSerializer):
    class Meta:
        model = isWatched
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}, 'video': {'required': False}, 'is_watched': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        is_watched = isWatched(
            user= SiteUser.objects.get(id=int(validated_data['user'])),
            video= Video.objects.get(id=int(validated_data['video'])),
            is_watched= validated_data['is_watched'],
        )
        is_watched.save()
        return is_watched