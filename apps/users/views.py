# -*- coding:utf-8 -*-

from django.shortcuts import render
from django.views.generic.base import View
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from .forms import *
from django.contrib.auth.backends import ModelBackend
from django.http import HttpResponseRedirect,JsonResponse
from django.utils.decorators import method_decorator

# Create your views here.

class CustomBackend(ModelBackend):
    def authenticate(self, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(Q(username=username)|Q(email=username))
            if user.check_password(password):
                return user
        except Exception as e:
            return None


class LoginView(View):
    def get(self,request):
        return render(request,"login.html")

    def post(self,request):
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            name = request.POST.get("username","")
            passwd = request.POST.get("password","")
            user = authenticate(username=name,password=passwd)
            if user is not None:
                login(request, user)
                # return render(request, "test.html",{"user":user})
                return JsonResponse({"status":0,"msg":u"登陆成功"})
            else:
                # return render(request, "login.html", {"login_form": login_form, "msg": u"用户名密码错误"})
                return JsonResponse({"status":1,"msg":u"用户名或密码错误"})

        else:
            return JsonResponse({"status":1,"msg":u"请填写用户名密码"})

class LogoutView(View):
    def post(self,request):
        try:
            logout(request)
            from django.core.urlresolvers import reverse
            return JsonResponse({"status": 0, "msg": "退出成功！", "url": "http://127.0.0.1:8000/login/"})
        except Exception:
            return JsonResponse({"status": 1, "msg": "异常"})


def login_required(function):
    """
    Decorator for views that checks that the user is logged in, redirecting
    to the log-in page if necessary.
    """
    def inner(request,*args,**kwargs):
        if not request.user.is_authenticated():
            return render(request,"login.html")
        return function(request,*args,**kwargs)
    return inner

class LoginRequiredView(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredView, self).dispatch(request, *args, **kwargs)