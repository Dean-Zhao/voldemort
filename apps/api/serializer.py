# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/2/26 下午10:12'

from rest_framework import serializers
from .models import ApiConfig,Tag
from django.contrib.auth.models import User
from django.forms import widgets


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name","father_id","create_time")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username","email","is_staff","is_active","last_login")


class ApiConfigSerializer(serializers.ModelSerializer):
    tag = TagSerializer()
    user = UserSerializer()
    class Meta:
        model = ApiConfig
        fields = ("path","method","parameter","name","tag","user","create_time")

