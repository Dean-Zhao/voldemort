# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/2/12 下午5:02'

from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(required=True)
    password = forms.CharField(required=True)