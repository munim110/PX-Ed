from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Video)
admin.site.register(Course)
admin.site.register(Chapter)
admin.site.register(VideoComment)
admin.site.register(CourseReview)
admin.site.register(EnrolledCourses)
admin.site.register(isWatched)