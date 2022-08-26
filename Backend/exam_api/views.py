from rest_framework.response import Response
from rest_framework import viewsets, filters
from exam_api.models import *
from exam_api.serializers import *

# Create your views here.


class MCQViewSet(viewsets.ModelViewSet):
    queryset = MCQ.objects.all()
    serializer_class = MCQSerializer


class AddMCQViewSet(viewsets.ModelViewSet):
    queryset = MCQ.objects.all()
    serializer_class = MCQSerializer

    def post(self, request):
        serializer = MCQSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})

class TrueFalseViewSet(viewsets.ModelViewSet):
    queryset = TrueFalse.objects.all()
    serializer_class = TrueFalseSerializer
    
class AddTrueFalseViewSet(viewsets.ModelViewSet):
    queryset = TrueFalse.objects.all()
    serializer_class = TrueFalseSerializer

    def post(self, request):
        serializer = TrueFalseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})
    
class ShortQuestionViewSet(viewsets.ModelViewSet):
    queryset = ShortQuestion.objects.all()
    serializer_class = ShortQuestionSerializer
    
class AddShortQuestionViewSet(viewsets.ModelViewSet):
    queryset = ShortQuestion.objects.all()
    serializer_class = ShortQuestionSerializer

    def post(self, request):
        serializer = ShortQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})

class ExamViewset(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['exam_chapter__id']


class AddExamViewset(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def post(self, request):
        serializer = ExamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})
    
class ExamAttemptViewset(viewsets.ModelViewSet):
    queryset = ExamAttempt.objects.all()
    serializer_class = ExamAttemptSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['exam__id']

class AddExamAttemptViewset(viewsets.ModelViewSet):
    queryset = ExamAttempt.objects.all()
    serializer_class = ExamAttemptSerializer

    def post(self, request):
        serializer = ExamAttemptSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'result': 'success'})
        return Response({'result': 'failure'})