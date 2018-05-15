# -*- coding:utf-8 -*-
from __future__ import unicode_literals
import datetime

from django.db import models
from django.contrib.auth.models import User
from api.models import Case,Proj,runtime_env


# Create your models here.

class plan(models.Model):
    name = models.CharField(max_length=50,verbose_name=u'计划名称')
    description = models.CharField(max_length=200,verbose_name=u"计划描述",null=True,blank=True)
    cases = models.ManyToManyField(Case, verbose_name=u'用例')
    user = models.ForeignKey(User, verbose_name=u"创建人")
    task_count = models.IntegerField(default=0,verbose_name=u'执行次数')
    create_time = models.DateTimeField(default=datetime.datetime.now, verbose_name=u"创建时间")
    update_time = models.DateTimeField(verbose_name=u"修改时间", auto_now=True)
    is_deleted = models.IntegerField(default=0, verbose_name=u"是否删除")

    class Meta:
        verbose_name = u'计划'
        verbose_name_plural = verbose_name

    def get_cases(self):
        _list = []
        for case in self.cases.all():
            if case.is_deleted == 0:
                _dict = dict(api = case.api.name,path = case.api.path,name = case.name,para = case.parameter,user = case.user.username,create_time = case.create_time)
                _list.append(_dict)
        return _list



    def get_values(self,*fields):
        _dict = {}
        for field in fields:
            f= self._meta.get_field(field)
            _value = getattr(self, field)
            if _value is None:
                _value = ''
            elif isinstance(f,models.ForeignKey):
                if field != 'user':
                    _value = _value.name
                else:
                    _value = _value.username
            elif field == 'cases':
                _dict[field]=self.get_cases()

            elif field in ('create_time','update_time'):
                _value = (_value+datetime.timedelta(0, 28799, 999986)).strftime("%Y-%m-%d %H:%M:%S") #北京时间
                # _value = _value.strftime("%Y-%m-%d %H:%M:%S") #utc时间
            _dict[field] = _value
        return _dict



class task(models.Model):
    headers = models.TextField(default='', verbose_name=u'头信息')
    cookies = models.TextField(default='', verbose_name=u'cookies')
    status = models.IntegerField(default=0,verbose_name=u'0:执行中，1：执行结束')
    plan = models.ForeignKey(plan)
    user = models.ForeignKey(User,null=True,blank=True)
    runtime_env = models.ForeignKey(runtime_env)
    create_time = models.DateTimeField(default=datetime.datetime.now, verbose_name=u"创建时间")
    update_time = models.DateTimeField(verbose_name=u"修改时间", auto_now=True)

    class Meta:
        verbose_name = u'执行'
        verbose_name_plural = verbose_name