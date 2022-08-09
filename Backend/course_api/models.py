from django.db import models
from user_api.models import SiteUser


class Course(models.Model):
    name = models.CharField(max_length=100)
    tags = models.CharField(max_length=200)
    description = models.TextField()
    target_audience = models.TextField()
    outline = models.TextField()
    outcome = models.TextField()
    instructor = models.CharField(max_length=100)
    thumbnail = models.ImageField(default=None, upload_to='Courses')
    def __str__(self):
        return self.name


class Chapter(models.Model):
    name = models.CharField(max_length=100)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    description = models.TextField()
    outcome = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.name

class Video(models.Model):
    video = models.FileField(upload_to='videos')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.description

class VideoComment(models.Model):
    comment = models.TextField()
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment


class isWatched(models.Model):
    user = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    is_watched = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username + " " + self.video.name