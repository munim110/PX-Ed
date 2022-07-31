from course_api import views
from rest_framework import routers
from django.urls import include, re_path

routers = routers.DefaultRouter()
routers.register(r'courses', views.CourseViewSet)
routers.register(r'chapters', views.ChapterViewSet)
routers.register(r'videos', views.VideoViewSet)
routers.register(r'add_courses', views.addCourseViewSet)
routers.register(r'add_chapters', views.addChapterViewSet)
routers.register(r'add_videos', views.addVideoViewSet)

urlpatterns = [
    re_path(r'^', include(routers.urls)),
]