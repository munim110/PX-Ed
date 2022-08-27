# Generated by Django 4.0.6 on 2022-08-27 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam_api', '0002_rename_chapter_exam_exam_chapter_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exam',
            name='uploadquestions',
        ),
        migrations.RemoveField(
            model_name='examattempt',
            name='correct_short',
        ),
        migrations.RemoveField(
            model_name='examattempt',
            name='manual_marks',
        ),
        migrations.RemoveField(
            model_name='examattempt',
            name='skipped_answers',
        ),
        migrations.RemoveField(
            model_name='examattempt',
            name='skipped_short',
        ),
        migrations.RemoveField(
            model_name='examattempt',
            name='skipped_truefalse',
        ),
        migrations.RemoveField(
            model_name='examattempt',
            name='uploadanswers',
        ),
        migrations.RemoveField(
            model_name='examattempt',
            name='wrong_short',
        ),
        migrations.AlterField(
            model_name='examattempt',
            name='short_answers',
            field=models.CharField(blank=True, max_length=2000),
        ),
        migrations.DeleteModel(
            name='UploadQuestion',
        ),
    ]