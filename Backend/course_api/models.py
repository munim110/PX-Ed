from django.db import models
from blog_api.models import Subject


class Course(models.Model):
    name = models.CharField(max_length=100)
    Subject = models.ManyToManyField(Subject)
    description = models.TextField()
    target_audience = models.TextField()
    outline = models.TextField()
    outcome = models.TextField()
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
    name = models.CharField(max_length=100)
    video = models.FileField(upload_to='videos')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.name
