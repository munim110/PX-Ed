from django.conf import settings
from django.urls import path
from .views import *
from django.conf.urls.static import static


urlpatterns = [
    path('post=<pk>', post, name='post'),
    path('', blog, name='blog'),
    path('home', home, name='home'),
]
