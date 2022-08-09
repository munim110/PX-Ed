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
routers.register(r'video_comments', views.VideoCommentViewSet)
routers.register(r'add_video_comments', views.addVideoCommentViewSet)
routers.register(r'is_watched', views.isWatchedViewSet)
routers.register(r'add_is_watched', views.addisWatchedViewSet)
routers.register(r'reviews', views.CourseReviewViewSet)
routers.register(r'add_review', views.addCourseReviewViewSet)
routers.register(r'enrolledcourses', views.EnrolledCoursesViewset)


urlpatterns = [
    re_path(r'^', include(routers.urls)),
]