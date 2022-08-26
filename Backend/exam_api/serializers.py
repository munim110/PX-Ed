from unicodedata import name
from rest_framework import serializers
from exam_api.models import *
from course_api.models import *
import datetime

class MCQSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQ
        fields = '__all__'
        extra_kwargs = {'question': {'required': False}, 'option_a': {'required': False}, 'option_b': {'required': False}, 'option_c': {'required': False}, 'option_d': {'required': False}, 'answer': {'required': False}, 'marks': {'required': False}, 'course': {'required': False}, 'chapter': {'required': False}}
        depth = 1

    def create(self, validated_data):
        mcq = MCQ(
            question=self.context['request'].data['question'],
            option_a=self.context['request'].data['option_a'],
            option_b=self.context['request'].data['option_b'],
            option_c=self.context['request'].data['option_c'],
            option_d=self.context['request'].data['option_d'],
            answer=self.context['request'].data['answer'],
            marks=self.context['request'].data['marks'],
        )
        mcq.save()
        exam = Exam.objects.get(id=int(self.context['request'].data['exam']))
        exam.questions.add(mcq)
        exam.set_all()
        exam.save()
        return mcq


class TrueFalseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrueFalse
        fields = '__all__'
        extra_kwargs = {'question': {'required': False}, 'answer': {'required': False}, 'marks': {'required': False}, 'course': {'required': False}, 'chapter': {'required': False}}
        depth = 1

    def create(self, validated_data):
        truefalse = TrueFalse(
            question=self.context['request'].data['question'],
            answer=self.context['request'].data['answer'],
            marks=self.context['request'].data['marks'],
        )
        truefalse.save()
        exam = Exam.objects.get(id=int(self.context['request'].data['exam']))
        exam.truefalse.add(truefalse)
        exam.set_all()
        exam.save()
        return truefalse


class ShortQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortQuestion
        fields = '__all__'
        extra_kwargs = {'question': {'required': False}, 'answer': {'required': False}, 'marks': {'required': False}, 'course': {'required': False}, 'chapter': {'required': False}}
        depth = 1

    def create(self, validated_data):
        shortquestion = ShortQuestion(
            question=self.context['request'].data['question'],
            answer=self.context['request'].data['answer'],
            marks=self.context['request'].data['marks'],
        )
        shortquestion.save()
        exam = Exam.objects.get(id=int(self.context['request'].data['exam']))
        exam.shortquestions.add(shortquestion)
        exam.set_all()
        exam.save()
        return shortquestion


class UploadQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadQuestion
        fields = '__all__'
        extra_kwargs = {'question': {'required': False}, 'marks': {'required': False}, 'course': {'required': False}, 'chapter': {'required': False}}
        depth = 1

    def create(self, validated_data):
        uploadquestion = UploadQuestion(
            question=self.context['request'].data['question'],
            marks=self.context['request'].data['marks'],
        )
        uploadquestion.save()
        exam = Exam.objects.get(id=int(self.context['request'].data['exam']))
        exam.uploadquestion.add(uploadquestion)
        exam.set_all()
        exam.save()
        return uploadquestion


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'
        extra_kwargs = {'exam_name': {'required': False}, 'exam_course': {'required': False}, 'exam_duration': {'required': False}, 'exam_chapter': {'required': False}}
        depth = 1

    def create(self, validated_data):
        exam = Exam(
            exam_name=self.context['request'].data['exam_name'],
            exam_course=Course.objects.get(id=self.context['request'].data['course']),
            exam_chapter=Chapter.objects.get(id=self.context['request'].data['chapter']),
            exam_duration=self.context['request'].data['exam_duration'],
        )
        exam.save()
        return exam


class ExamAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamAttempt
        fields = '__all__'
        extra_kwargs = {'exam': {'required': False}, 'user': {'required': False}, 'attempt_date': {'required': False}, 'marks': {'required': False}, 'attempt_status': {'required': False}}
        depth = 1

    def create(self, validated_data):
        examattempt = ExamAttempt(
            exam=Exam.objects.get(id=self.context['request'].data['exam']),
            user=SiteUser.objects.get(id=self.context['request'].data['user']),
            time = datetime.datetime.now(),
            question_answers = self.context['request'].data['question_answers'],
            truefalse_answers = self.context['request'].data['truefalse_answers'],
            shortquestion_answers = self.context['request'].data['shortquestion_answers'],
        )
        examattempt.save()
        return examattempt





