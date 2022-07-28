from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
AbstractUser._meta.get_field('email')._unique = True

class SiteUser(AbstractUser):
    profile_pic = models.ImageField(default='/ProfilePics/default.jpg', upload_to='ProfilePics')
    special_user = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('username', 'email')