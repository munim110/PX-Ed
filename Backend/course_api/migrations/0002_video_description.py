# Generated by Django 4.0.2 on 2022-07-17 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]