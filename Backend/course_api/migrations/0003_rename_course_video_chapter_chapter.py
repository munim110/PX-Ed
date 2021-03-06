# Generated by Django 4.0.2 on 2022-07-17 10:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course_api', '0002_video_description'),
    ]

    operations = [
        migrations.RenameField(
            model_name='video',
            old_name='course',
            new_name='chapter',
        ),
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_api.course')),
            ],
        ),
    ]
