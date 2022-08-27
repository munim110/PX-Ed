from django.db import models
from course_api.models import *
from user_api.models import *

# Create your models here.

choices = [('a', 'a'), ('b', 'b'), ('c', 'c'), ('d', 'd')]

class MCQ(models.Model):
    question = models.CharField(max_length=200)
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    option_c = models.CharField(max_length=200)
    option_d = models.CharField(max_length=200)
    answer = models.CharField(max_length=1, choices=choices)
    marks = models.IntegerField(default=1)

    def __str__(self):
        return self.question

class TrueFalse(models.Model):
    question = models.CharField(max_length=200)
    answer = models.BooleanField()
    marks = models.IntegerField(default=1)

    def __str__(self):
        return self.question

class ShortQuestion(models.Model):
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)
    marks = models.IntegerField(default=5)
    
    def __str__(self):
        return self.question


class Exam(models.Model):
    exam_name = models.CharField(max_length=200)
    exam_course = models.ForeignKey(Course, on_delete=models.CASCADE)
    exam_chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    exam_duration = models.IntegerField(default=25)
    total_marks = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    questions = models.ManyToManyField(MCQ, blank=True)
    truefalse = models.ManyToManyField(TrueFalse, blank=True)
    shortquestions = models.ManyToManyField(ShortQuestion, blank=True)

    def set_total_marks(self):
        marks = 0
        for question in self.questions.all():
            marks += question.marks
        for question in self.truefalse.all():
            marks += question.marks
        for question in self.shortquestions.all():
            marks += question.marks
        for question in self.uploadquestions.all():
            marks += question.marks
        self.total_marks = marks
        self.save()
    
    def set_total_questions(self):
        questions = 0
        for question in self.questions.all():
            questions += 1
        for question in self.truefalse.all():
            questions += 1
        for question in self.shortquestions.all():
            questions += 1
        for question in self.uploadquestions.all():
            questions += 1
        self.total_questions = questions
        self.save()
    
    def set_all(self):
        self.set_total_marks()
        self.set_total_questions()

    def __str__(self):
        return self.exam_name


class ExamAttempt(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    user = models.ForeignKey(SiteUser , on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    question_answers = models.CharField(max_length=200, blank=True)
    truefalse_answers = models.CharField(max_length=200, blank=True)
    short_answers = models.CharField(max_length=2000, blank=True)
    correct_answers = models.IntegerField(default=0)
    correct_truefalse = models.IntegerField(default=0)
    wrong_answers = models.IntegerField(default=0)
    wrong_truefalse = models.IntegerField(default=0)
    total_marks = models.IntegerField(default=0)


    def set_corrrect_answers(self):
        all_answers = self.question_answers.split('$')
        n = self.exam.questions.all().count()
        for i in range(n):
            if all_answers[i] == self.exam.questions.all()[i].answer:
                self.correct_answers += 1
                self.total_marks += self.exam.questions.all()[i].marks
        self.save()
    
    def set_correct_truefalse(self):
        all_answers = self.truefalse_answers.split('$')
        n = self.exam.truefalse.all().count()
        for i in range(n):
            if all_answers[i] == str(self.exam.truefalse.all()[i].answer).lower():
                self.correct_truefalse += 1
                self.total_marks += self.exam.truefalse.all()[i].marks
        self.save()
    
    def set_wrong_answers(self):
        all_answers = self.question_answers.split('$')
        n = self.exam.questions.all().count()
        for i in range(n):
            if all_answers[i] != self.exam.questions.all()[i].answer:
                self.wrong_answers += 1
        self.save()
    
    def set_wrong_truefalse(self):
        all_answers = self.truefalse_answers.split('$')
        n = self.exam.truefalse.all().count()
        for i in range(n):
            if all_answers[i] != str(self.exam.truefalse.all()[i].answer).lower():
                self.wrong_truefalse += 1
        self.save()


    def set_all(self):
        self.set_corrrect_answers()
        self.set_correct_truefalse()
        self.set_wrong_answers()
        self.set_wrong_truefalse()

    
    
    
    
    
