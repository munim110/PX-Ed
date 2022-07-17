# Generated by Django 4.0.2 on 2022-07-17 10:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('blog_api', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('target_audience', models.TextField()),
                ('outline', models.TextField()),
                ('outcome', models.TextField()),
                ('Subject', models.ManyToManyField(to='blog_api.Subject')),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('video', models.FileField(upload_to='videos')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_api.course')),
            ],
        ),
    ]