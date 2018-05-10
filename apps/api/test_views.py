# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/3/27 下午4:09'
import json
import requests
from django.shortcuts import render
from django.views.generic.base import View
from django.http import JsonResponse, HttpResponse
from .forms import *
from task.models import runtime_env
from .models import Api, Tag, Case, Proj, Result
from users.views import login_required, LoginRequiredView
import hashlib

def dealParam(para):
    data = '&'.join([item + '=' + str(para[item]) for item in para.iterkeys()])
    return data


def save_result(r, case, task_id):
    result = Result()
    result.case = case
    result.request_headers = r.headers.__str__()
    result.response_cookies = r.cookies.__str__()
    result.response = r.text.decode("unicode-escape")
    result.status_code = r.status_code
    result.request_headers = r.request.headers.__str__()
    result.url = r.url
    result.task_id = task_id
    result.save()
    return result.id


def save_exception(e, case, task_id):
    result = Result()
    result.case = case
    result.status_code = 0
    result.task_id = task_id
    result.desp = e.message
    result.save()


def enctype_1(env, para):
    s = []

    # temp_para = {}
    para["appId"] = env.app_id
    # for key,value in para.items():
    #     para[key] = value
    for key in sorted(para.keys()):
        s.append(key+'='+para[key])
    p = '&'.join(s)
    md5 = hashlib.md5()
    md5.update(p+env.token_id)
    res = md5.hexdigest()
    para["sign"]=res.upper()

    return para

def enctype_2(env, para):
    s = []

    # temp_para = {}
    para["appId"] = env.app_id
    # for key,value in para.items():
    #     para[key] = value
    for key in sorted(para.keys()):
        s.append(key+'='+para[key])
    p = ','.join(s)
    md5 = hashlib.md5()
    md5.update(p+env.token_id)
    res = md5.hexdigest()
    para["sign"]=res.upper()

    return para


def test_case(env_id, case):
    """
    执行用例接口
    :param env_id: 执行环境
    :param case: 测试用例
    :return: 返回r
    """
    env = runtime_env.objects.get(id=int(env_id))
    headers = case.headers
    cookies = case.cookies
    parameter = case.parameter
    if headers:
        headers = json.loads(headers)
    if cookies:
        cookies = json.loads(cookies)
    if parameter:
        parameter = json.loads(parameter)
    enctype = case.encryption_type
    if enctype == 1:
        parameter = enctype_1(env,parameter)
    elif enctype == 2:
        parameter = enctype_2(env,parameter)

    api = case.api
    url = env.uri + api.path
    method = api.method
    if method == 'post':
        r = requests.post(url, data=parameter, headers=headers, cookies=cookies)
    elif method == 'get':
        if parameter:
            parameter = dealParam(parameter)
            r = requests.get(url + '?' + parameter, headers=headers, cookies=cookies)
        else:
            r = requests.get(url, headers=headers, cookies=cookies)

    return r


class CaseTestView(LoginRequiredView, View):
    def get(self, request, case_id):
        case = Case.objects.filter(id=int(case_id), is_deleted=0)[0]
        if case:
            api = case.api
            tags = Tag.objects.filter(is_deleted=0).order_by("id")
            if case.parameter == '':
                para = json.loads('{}')
            else:
                para = json.loads(case.parameter)
            if case.headers == '':
                headers = json.loads('{}')
            else:
                headers = json.loads(case.headers)
            if case.cookies == '':
                cookies = json.loads('{}')
            else:
                cookies = json.loads(case.cookies)
            if case.validation == '':
                valids = json.loads('{}')
            else:
                valids = json.loads(case.validation)

            return render(request, 'api_testcase_test.html',
                          {"api": api, "tags": tags, "case": case, "para": para, "headers": headers,
                           "cookies": cookies, "valids": valids})
        else:
            return render(request, 'wrong.html')

    def post(self, request, case_id):
        if not Case.objects.get(id=int(case_id)):
            return JsonResponse({"msg": u"不存在"})
        task_id = request.POST.get("task_id", '')
        if task_id:
            task_id = int(task_id)
        else:
            task_id = 0
        case = Case.objects.get(id=int(case_id))
        try:
            r = test_case(2, case)
            save_result(r, case, task_id)

        except Exception as e:
            save_exception(e, case, task_id)
        if r.status_code == 200:
            return JsonResponse({"status": 0, "message": u"测试成功",
                                 "result": {"status_code": r.status_code, "url": r.url, "text": r.json(),
                                            "c": r.cookies.__str__(), "h": r.headers.__str__()}})
        else:
            return JsonResponse({"status": 1, "message": u"测试失败"})
