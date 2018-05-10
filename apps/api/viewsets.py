# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/2/26 下午10:24'

from rest_framework import viewsets

from .serializer import TagSerializer,UserSerializer,ApiConfigSerializer
from .models import Tag,ApiConfig
from django.contrib.auth.models import User

class TagViewset(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def perform_create(self, serializer):
        serializer.save()

class ApiConfigViewset(viewsets.ModelViewSet):
    queryset = ApiConfig.objects.all()
    serializer_class = ApiConfigSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('user', 'tag', 'name',)

class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = (IsAdminUser,)
    serializer_class = UserSerializer
