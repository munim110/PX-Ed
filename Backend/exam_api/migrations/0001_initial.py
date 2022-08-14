# Generated by Django 4.0.2 on 2022-08-12 16:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('course_api', '0003_video_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Exam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('duration', models.IntegerField(default=25)),
                ('total_marks', models.IntegerField(default=0)),
                ('total_questions', models.IntegerField()),
                ('chapter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_api.chapter')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_api.course')),
            ],
        ),
        migrations.CreateModel(
            name='MCQ',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=200)),
                ('option_a', models.CharField(max_length=200)),
                ('option_b', models.CharField(max_length=200)),
                ('option_c', models.CharField(max_length=200)),
                ('option_d', models.CharField(max_length=200)),
                ('answer', models.CharField(choices=[('a', 'a'), ('b', 'b'), ('c', 'c'), ('d', 'd')], max_length=1)),
                ('marks', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='ShortQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=200)),
                ('answer', models.CharField(max_length=200)),
                ('marks', models.IntegerField(default=5)),
            ],
        ),
        migrations.CreateModel(
            name='TrueFalse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=200)),
                ('answer', models.BooleanField()),
                ('marks', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='UploadQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=200)),
                ('marks', models.IntegerField(default=10)),
            ],
        ),
        migrations.CreateModel(
            name='ExamAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('uploadanswers', models.FileField(blank=True, upload_to='answers/')),
                ('question_answers', models.CharField(blank=True, max_length=200)),
                ('truefalse_answers', models.CharField(blank=True, max_length=200)),
                ('short_answers', models.CharField(blank=True, max_length=200)),
                ('manual_marks', models.IntegerField(default=0)),
                ('correct_answers', models.IntegerField(default=0)),
                ('correct_truefalse', models.IntegerField(default=0)),
                ('correct_short', models.IntegerField(default=0)),
                ('wrong_answers', models.IntegerField(default=0)),
                ('wrong_truefalse', models.IntegerField(default=0)),
                ('wrong_short', models.IntegerField(default=0)),
                ('skipped_answers', models.IntegerField(default=0)),
                ('skipped_truefalse', models.IntegerField(default=0)),
                ('skipped_short', models.IntegerField(default=0)),
                ('total_marks', models.IntegerField(default=0)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exam_api.exam')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='exam',
            name='questions',
            field=models.ManyToManyField(blank=True, to='exam_api.MCQ'),
        ),
        migrations.AddField(
            model_name='exam',
            name='shortquestions',
            field=models.ManyToManyField(blank=True, to='exam_api.ShortQuestion'),
        ),
        migrations.AddField(
            model_name='exam',
            name='truefalse',
            field=models.ManyToManyField(blank=True, to='exam_api.TrueFalse'),
        ),
        migrations.AddField(
            model_name='exam',
            name='uploadquestions',
            field=models.ManyToManyField(blank=True, to='exam_api.UploadQuestion'),
        ),
    ]