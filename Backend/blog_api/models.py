from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class Blog(models.Model):
    title = models.CharField(max_length=200)
    tags = models.CharField(max_length=200)
    thumbnail = models.ImageField(default=None)
    author = models.CharField(max_length=30)
    subject = models.ManyToManyField(Subject)
    publish_date = models.DateField()
    content = models.TextField()

    def __str__(self):
        return self.title
    
    class Meta:
        unique_together = ('title', 'thumbnail')