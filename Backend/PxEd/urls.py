from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from user_api.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    re_path(r'^api/', include('blog_api.urls')),
    re_path('auth/', UserObtainAuthToken.as_view()),
    re_path(r'^api/', include('user_api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
