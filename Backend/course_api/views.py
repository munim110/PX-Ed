from rest_framework.response import Response
from rest_framework import viewsets, filters
from course_api.models import *
from course_api.serializers import ChapterSerializer, CourseSerializer, VideoSerializer, VideoCommentSerializer, isWatchedSerializer

# Create your views here.
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['name', 'description', 'target_audience', 'instructor', 'tags']

class addCourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['course__id']


class addChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer

    def post(self, request):
        serializer = ChapterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['chapter__id']


class addVideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def post(self, request):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})


class VideoCommentViewSet(viewsets.ModelViewSet):
    queryset = VideoComment.objects.all()
    serializer_class = VideoCommentSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['video__id']


class addVideoCommentViewSet(viewsets.ModelViewSet):
    queryset = VideoComment.objects.all()
    serializer_class = VideoCommentSerializer

    def post(self, request):
        serializer = VideoCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})



class isWatchedViewSet(viewsets.ModelViewSet):
    queryset = isWatched.objects.all()
    serializer_class = isWatchedSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['video__id']


class addisWatchedViewSet(viewsets.ModelViewSet):
    queryset = isWatched.objects.all()
    serializer_class = isWatchedSerializer

    def post(self, request):
        serializer = isWatchedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})