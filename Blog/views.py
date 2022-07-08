from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from .models import *


# Create your views here.


def post(request, pk):
    blog_post = Blog.objects.get(id=pk)
    context = {
        'blog_post': blog_post,
    }
    return render(request, 'blog/post.html', context)


def blog(request):
    blog_post = Blog.objects.all().order_by('-id')
    context = {
        'blog_post': blog_post,
    }
    return render(request, 'blog/blog.html', context)

def home(request):
    pass