# Generated by Django 4.0.2 on 2022-07-17 10:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course_api', '0003_rename_course_video_chapter_chapter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='chapter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_api.chapter'),
        ),
    ]