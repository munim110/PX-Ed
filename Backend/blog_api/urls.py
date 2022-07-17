from blog_api import views
from rest_framework import routers
from django.urls import include, re_path

routers = routers.DefaultRouter()
routers.register(r'blogs', views.BlogViewset)

urlpatterns = [
    re_path(r'^', include(routers.urls)),
]