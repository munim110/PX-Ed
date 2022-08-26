from exam_api import views
from rest_framework import routers
from django.urls import include, re_path

routers = routers.DefaultRouter()
routers.register(r'exams', views.ExamViewset)
routers.register(r'add-exam', views.AddExamViewset)

urlpatterns = [
    re_path(r'^', include(routers.urls)),
]