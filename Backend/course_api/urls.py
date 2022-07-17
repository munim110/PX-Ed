from course_api import views
from rest_framework import routers
from django.urls import include, re_path

routers = routers.DefaultRouter()
routers.register(r'courses', views.CourseViewSet)

urlpatterns = [
    re_path(r'^', include(routers.urls)),
]