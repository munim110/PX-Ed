from exam_api import views
from rest_framework import routers
from django.urls import include, re_path

routers = routers.DefaultRouter()



urlpatterns = [
    re_path(r'^', include(routers.urls)),
]