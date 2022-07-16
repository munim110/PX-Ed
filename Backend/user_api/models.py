from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
AbstractUser._meta.get_field('email')._unique = True

class SiteUser(AbstractUser):
    profile_pic = models.ImageField(default=None)
    
    class Meta:
        unique_together = ('username', 'email')