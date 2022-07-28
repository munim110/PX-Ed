from rest_framework import filters
from rest_framework import viewsets
from rest_framework.response import Response

from blog_api.models import *
from blog_api.serializers import BlogSerializer

# Create your views here.

class BlogViewset(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    
    filter_backends = (filters.SearchFilter,)
    search_fields = ['title', 'tags', 'author', 'subject__name', 'content']
    
class AddBlogViewset(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    
    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})