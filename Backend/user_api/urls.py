from rest_framework import routers
from . import views
from django.urls import include, re_path

router = routers.DefaultRouter()
router.register(r'users', views.UserViewset)

urlpatterns = [
    re_path(r'^', include(router.urls)),
]