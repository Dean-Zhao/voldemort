# -*- coding:utf-8 -*-

from __future__ import unicode_literals
import datetime

from django.db import models
from django.contrib.auth.models import User
# Create your models here

class Proj(models.Model):
    name = models.CharField(max_length=50,verbose_name=u"项目名称")
    father_id = models.IntegerField(default=0,verbose_name=u"上一级项目id")
    deleted = models.IntegerField(default=0,verbose_name=u"是否删除")
    create_time = models.DateTimeField(default=datetime.datetime.now,verbose_name=u"创建时间")

    def natural_key(self):
        return self.name

    def get_all_env(self):
        return self.runtime_env_set.filter(is_deleted=0)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u"项目名"
        verbose_name_plural = verbose_name



class Tag(models.Model):
    name = models.CharField(max_length=50,verbose_name=u"标签名称")
    is_deleted = models.IntegerField(default=0,verbose_name=u"是否删除")
    create_time = models.DateField(default=datetime.datetime.now,verbose_name=u"创建时间")

    class Meta:
        verbose_name = u"特性"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name


class Api(models.Model):
    path = models.CharField(max_length=100,verbose_name=u"api路径")
    method = models.CharField(max_length=10,choices=(("get","get"),("post","post"),("put","put")))
    name = models.CharField(max_length=20,verbose_name=u"api名称")
    description = models.CharField(max_length=200,verbose_name=u"api描述",null=True,blank=True)
    proj = models.ForeignKey(Proj,verbose_name=u"所属项目")
    user = models.ForeignKey(User,verbose_name=u"创建人")
    create_time = models.DateTimeField(default=datetime.datetime.now,verbose_name=u"创建时间")
    update_time = models.DateTimeField(verbose_name=u"修改时间",auto_now = True)
    is_deleted = models.IntegerField(default=0,verbose_name=u"是否删除")

    class Meta:
        verbose_name = u"API"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

    def get_all_case(self):
        return self.case_set.filter(is_deleted=0)

    def get_username(self):
        return User.objects.get(kw=self.user)

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

            elif field in ('create_time','update_time'):
                _value = (_value+datetime.timedelta(0, 28799, 999986)).strftime("%Y-%m-%d %H:%M:%S") #北京时间
                # _value = _value.strftime("%Y-%m-%d %H:%M:%S") #utc时间
            _dict[field] = _value
        return _dict




class Case(models.Model):
    name = models.CharField(max_length=50,verbose_name=u"用例名称")
    headers = models.TextField(null=True,blank=True)
    cookies = models.TextField(null=True,blank=True)
    parameter = models.TextField(null=True,blank=True)
    api = models.ForeignKey(Api,verbose_name=u"所属api")
    tag = models.ForeignKey(Tag,null=True,blank=True,verbose_name=u"用例标签")
    encryption_type = models.IntegerField(default=0,verbose_name=u"加密方式")
    validation = models.CharField(max_length=200,null=True,blank=True)
    user = models.ForeignKey(User, verbose_name=u"创建人")
    create_time = models.DateTimeField(default=datetime.datetime.now, verbose_name=u"创建时间")
    update_time = models.DateTimeField(verbose_name=u"修改时间",auto_now = True)
    is_deleted = models.IntegerField(default=0, verbose_name=u"是否删除")

    def get_values(self,*fields):
        _dict = {}
        for field in fields:
            f= self._meta.get_field(field)
            _value = getattr(self, field)
            if _value is None:
                _value = ''
            elif isinstance(f,models.ForeignKey) :
                if field != 'user':
                    _value = _value.name
                else:
                    _value = _value.username
            elif field in ('create_time','update_time'):
                _value = (_value+datetime.timedelta(0, 28799, 999986)).strftime("%Y-%m-%d %H:%M:%S")

            _dict[field] = _value
        return _dict

    class Meta:
        verbose_name = u"用例"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class runtime_env(models.Model):
    name = models.CharField(max_length=20,verbose_name=u'环境名')
    uri = models.CharField(max_length=50,verbose_name=u'环境路径')
    app_id = models.CharField(null=True,blank=True,max_length=100,verbose_name=u'appId')
    token_id = models.CharField(null=True,blank=True,max_length=100,verbose_name=u'tokenId')
    Proj = models.ForeignKey(Proj,verbose_name=u'所属项目')
    is_deleted = models.IntegerField(default=0, verbose_name=u"是否删除")

    class Meta:
        verbose_name = u'执行环境'
        verbose_name_plural = verbose_name

class Result(models.Model):
    case = models.ForeignKey(Case,verbose_name=u"测试用例")
    url = models.CharField(max_length=200,verbose_name=u'请求url',default='')
    runtime_env = models.ForeignKey(runtime_env,verbose_name=u'运行环境')
    status_code = models.IntegerField(verbose_name=u"响应状态码")
    response = models.TextField(verbose_name=u'响应结果')
    request_headers = models.TextField(default='',verbose_name=u'请求头信息')
    response_headers = models.TextField(default='',verbose_name=u'响应头信息')
    response_cookies = models.TextField(default='',verbose_name=u'响应cookies')
    desp = models.TextField(default='',verbose_name=u'执行情况')
    is_pass = models.IntegerField(default=0,verbose_name=u'0：默认不填写，1：通过，-1：不通过')
    task_id = models.IntegerField(default=0,verbose_name=u'0：测试，其他：任务id')
    create_time = models.DateTimeField(default=datetime.datetime.now,verbose_name=u"创建时间")

    def get_all_valids(self):
        return self.verification_set.all()


    class Meta:
        verbose_name = u"测试"
        verbose_name_plural = verbose_name



    def __unicode__(self):
        return self.id

class verification(models.Model):
    key = models.CharField(max_length=50,verbose_name=u'验证键名')
    exp_value = models.CharField(max_length=100,verbose_name=u"期望值")
    value = models.CharField(max_length=100,verbose_name=u"实际值")
    is_pass = models.IntegerField(default=0,verbose_name=u"验证是否通过，0：waiting，1：pass，-1：fail")
    case = models.ForeignKey(Case,verbose_name=u"caseId")
    Result = models.ForeignKey(Result,verbose_name=u"请求id")

    class Meta:
        verbose_name = u"验证"
        verbose_name_plural = verbose_name



