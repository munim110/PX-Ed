from rest_framework.response import Response
from rest_framework import viewsets, filters
from exam_api.models import *
from exam_api.serializers import *

# Create your views here.

def addMCQViewSet(request):
    serializer = MCQSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'result': 'success'})
    return Response({'result': 'failure'})


def addTrueFalseViewSet(request):
    serializer = TrueFalseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'result': 'success'})
    return Response({'result': 'failure'})


def addShortQuestionViewSet(request):
    serializer = ShortQuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'result': 'success'})
    return Response({'result': 'failure'})


def addUploadQuestionViewSet(request):
    serializer = UploadQuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'result': 'success'})
    return Response({'result': 'failure'})


def addExamViewSet(request):
    serializer = ExamSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'result': 'success'})
    return Response({'result': 'failure'})

