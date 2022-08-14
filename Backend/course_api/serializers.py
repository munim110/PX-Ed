from unicodedata import name
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
        print(self.context['request'].data['outcome'])
        chapter = Chapter(
            name=validated_data['name'],
            description=validated_data['description'],
            course= Course.objects.get(id=int(self.context['request'].data['course'])),
            outcome = self.context['request'].data['outcome'],
        )
        chapter.save()
        return chapter

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
        extra_kwargs = {'description': {'required': False}, 'chapter': {'required': False}, 'video': {'required': False}, 'name': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        video = Video(
            description=self.context['request'].data['description'],
            chapter= Chapter.objects.get(id=int(self.context['request'].data['chapter'])),
            name = self.context['request'].data['name'],
        )
        video.save()
        return video
    
    def delete(self, validated_data):
        video = Video.objects.get(id=int(self.context['request'].data['id']))
        video.delete()
        return video


class VideoCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoComment
        fields = '__all__'
        extra_kwargs = {'comment': {'required': False}, 'video': {'required': False}, 'user': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        print(validated_data)
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
            user= SiteUser.objects.get(id=int(self.context['request'].data['user'])),
            video= Video.objects.get(id=int(self.context['request'].data['video'])),
            is_watched= self.context['request'].data['is_watched'],
        )
        is_watched.save()
        return is_watched
    
class CourseReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseReview
        fields = '__all__'
        extra_kwargs = {'review': {'required': False}, 'course': {'required': False}, 'user': {'required': False}, 'rating': {'required': False}}
        depth = 1
    
    def create(self, validated_data):
        course_review = CourseReview(
            review=self.context['request'].data['review'],
            rating=self.context['request'].data['rating'],
            course= Course.objects.get(id=int(self.context['request'].data['course'])),
            user= SiteUser.objects.get(id=int(self.context['request'].data['user'])),
        )
        course_review.save()
        return course_review
    
class EnrolledCoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrolledCourses
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}, 'course': {'required': False}}
        depth = 1
        
    def create(self, validated_data):
        enrolled_course = EnrolledCourses(
            user=SiteUser.objects.get(id=int(self.context['request'].data['user'])),
            course=Course.objects.get(id=int(self.context['request'].data['course'])),
        )
        enrolled_course.save()
        return enrolled_course