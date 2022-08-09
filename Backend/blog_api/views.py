from rest_framework import filters
from rest_framework import viewsets
from rest_framework.response import Response

from blog_api.models import *
from blog_api.serializers import BlogSerializer, BlogCommentSerializer

# Create your views here.

class BlogViewset(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    
    filter_backends = (filters.SearchFilter,)
    search_fields = ['title', 'tags', 'author', 'content']
    
class AddBlogViewset(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    
    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})


class BlogCommentViewset(viewsets.ModelViewSet):
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    
    filter_backends = (filters.SearchFilter,)
    search_fields = ['blog__id']


class AddBlogCommentViewset(viewsets.ModelViewSet):
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    
    def post(self, request):
        serializer = BlogCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})

