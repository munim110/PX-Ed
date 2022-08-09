from blog_api import views
from rest_framework import routers
from django.urls import include, re_path

routers = routers.DefaultRouter()
routers.register(r'blogs', views.BlogViewset)
routers.register(r'add-blog', views.AddBlogViewset)
routers.register(r'blog-comments', views.BlogCommentViewset)
routers.register(r'add-blog-comments', views.AddBlogCommentViewset)
routers.register(r'blog-comments', views.BlogCommentViewset)

urlpatterns = [
    re_path(r'^', include(routers.urls)),
]