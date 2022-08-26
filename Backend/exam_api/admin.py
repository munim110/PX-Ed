from django.contrib import admin

# Register your models here.

from exam_api.models import *


admin.site.register(MCQ)
admin.site.register(TrueFalse)
admin.site.register(ShortQuestion)
admin.site.register(Exam)
admin.site.register(ExamAttempt)