from rest_framework import serializers
from blog_api.models import *

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'
        extra_kwargs = {'title': {'required': False}, 'tags': {'required': False}, 'author': {'required': False}, 'content': {'required': False}}
        depth = 1
        
    def create(self, validated_data):
        blog = Blog(
            title=validated_data['title'],
            content=validated_data['content'],
            author=validated_data['author'],
            tags=validated_data['tags'],
        )
        blog.save()
        return blog