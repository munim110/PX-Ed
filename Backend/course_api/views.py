from rest_framework.response import Response
from rest_framework import viewsets
from course_api.models import *
from course_api.serializers import CourseSerializer

# Create your views here.
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    def get_queryset(self):
        queryset = Course.objects.all()
        course_id = self.request.query_params.get('course_id', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset
    def list(self, request):
        queryset = self.get_queryset()
        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)
    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        course = queryset.get(course_id=pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    def create(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    def update(self, request, pk=None):
        queryset = self.get_queryset()
        course = queryset.get(course_id=pk)
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    def destroy(self, request, pk=None):
        queryset = self.get_queryset()
        course = queryset.get(course_id=pk)
        course.delete()
        return Response(status=204)
    def partial_update(self, request, pk=None):
        queryset = self.get_queryset()
        course = queryset.get(course_id=pk)