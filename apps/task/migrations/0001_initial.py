# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-05-14 02:59
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='plan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='\u8ba1\u5212\u540d\u79f0')),
                ('description', models.CharField(blank=True, max_length=200, null=True, verbose_name='\u8ba1\u5212\u63cf\u8ff0')),
                ('task_count', models.IntegerField(default=0, verbose_name='\u6267\u884c\u6b21\u6570')),
                ('create_time', models.DateTimeField(default=datetime.datetime.now, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('update_time', models.DateTimeField(auto_now=True, verbose_name='\u4fee\u6539\u65f6\u95f4')),
                ('is_deleted', models.IntegerField(default=0, verbose_name='\u662f\u5426\u5220\u9664')),
                ('cases', models.ManyToManyField(to='api.Case', verbose_name='\u7528\u4f8b')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='\u521b\u5efa\u4eba')),
            ],
            options={
                'verbose_name': '\u8ba1\u5212',
                'verbose_name_plural': '\u8ba1\u5212',
            },
        ),
        migrations.CreateModel(
            name='runtime_env',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='\u73af\u5883\u540d')),
                ('uri', models.CharField(max_length=50, verbose_name='\u73af\u5883\u8def\u5f84')),
                ('app_id', models.CharField(blank=True, max_length=100, null=True, verbose_name='appId')),
                ('token_id', models.CharField(blank=True, max_length=100, null=True, verbose_name='tokenId')),
                ('is_deleted', models.IntegerField(default=0, verbose_name='\u662f\u5426\u5220\u9664')),
                ('Proj', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.Proj', verbose_name='\u6240\u5c5e\u9879\u76ee')),
            ],
            options={
                'verbose_name': '\u6267\u884c\u73af\u5883',
                'verbose_name_plural': '\u6267\u884c\u73af\u5883',
            },
        ),
        migrations.CreateModel(
            name='task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('headers', models.TextField(default='', verbose_name='\u5934\u4fe1\u606f')),
                ('cookies', models.TextField(default='', verbose_name='cookies')),
                ('status', models.IntegerField(default=0, verbose_name='0:\u6267\u884c\u4e2d\uff0c1\uff1a\u6267\u884c\u7ed3\u675f')),
                ('create_time', models.DateTimeField(default=datetime.datetime.now, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('update_time', models.DateTimeField(auto_now=True, verbose_name='\u4fee\u6539\u65f6\u95f4')),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='task.plan')),
                ('runtime_env', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='task.runtime_env')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '\u6267\u884c',
                'verbose_name_plural': '\u6267\u884c',
            },
        ),
    ]
