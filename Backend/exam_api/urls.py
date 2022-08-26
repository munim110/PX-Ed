from exam_api import views
from rest_framework import routers
from django.urls import include, re_path

routers = routers.DefaultRouter()
routers.register(r'exams', views.ExamViewset)
routers.register(r'add-exam', views.AddExamViewset)
routers.register(r'mcqs', views.MCQViewSet)
routers.register(r'add-mcq', views.AddMCQViewSet)
routers.register(r'truefalse', views.TrueFalseViewSet)
routers.register(r'add-truefalse', views.AddTrueFalseViewSet)
routers.register(r'shortquestions', views.ShortQuestionViewSet)
routers.register(r'add-shortquestion', views.AddShortQuestionViewSet)

urlpatterns = [
    re_path(r'^', include(routers.urls)),
]