from rest_framework import filters
from rest_framework import viewsets

from blog_api.models import *
from blog_api.serializers import BlogSerializer

# Create your views here.

class BlogViewset(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    
    filter_backends = (filters.SearchFilter,)
    search_fields = ['title', 'tags', 'author', 'subject__name', 'content']