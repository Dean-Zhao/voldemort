# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/3/27 下午4:09'
import json
import requests
from django.shortcuts import render
from django.views.generic.base import View
from django.http import JsonResponse, HttpResponse
from .models import Api, Tag, Case, Proj, Result,verification,runtime_env
from users.views import login_required, LoginRequiredView
import hashlib
import urllib
from time import sleep

def dealParam(para):
    data = '&'.join([item + '=' + str(para[item]) for item in para.iterkeys()])
    return data


def save_result(r, case, task_id, env_id):
    result = Result()
    result.case = case
    result.request_headers = r.headers.__str__()
    result.response_cookies = r.cookies.__str__()
    result.response = r.text.decode("unicode-escape")
    result.status_code = r.status_code
    result.request_headers = r.request.headers.__str__()
    result.url = r.url
    result.task_id = task_id
    result.runtime_env = runtime_env.objects.get(id=(env_id))
    result.save()
    return result.id


def save_exception(e, case, task_id, env_id):
    result = Result()
    result.case = case
    result.status_code = 0
    result.task_id = task_id
    result.runtime_env = runtime_env.objects.get(id=(env_id))
    result.desp = e.message
    result.save()
    return result.id


def enctype_1(env, para):
    s = []

    # temp_para = {}
    if env.app_id:
        para["appId"] = env.app_id
    else:
        para["appId"] = ''
    # for key,value in para.items():
    #     para[key] = value
    for key in sorted(para.keys()):
        s.append(urllib.urlencode({key:para[key]}))
    p = '&'.join(s)
    md5 = hashlib.md5()
    if env.token_id:
        md5.update(p+env.token_id)
    else:
        md5.update(p)
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


def verify(result_id,valids):
    result = Result.objects.get(id=int(result_id))
    result.is_pass = 1
    for item in valids.keys():
        val = verification()
        val.Result = result
        val.case = result.case
        val.key = item
        if valids[item]:
            val.exp_value = valids[item]
        else:
            val.exp_value = ''
        val.value = 'NULL'
        val.is_pass = -1
        val.save()

    if result.desp != '' or result.status_code != 200:
        result.is_pass = -1

    try:
        response = json.loads(result.response)
        v = result.get_all_valids()
        for item in v:
            l = item.key.split('.')
            key = 'response["' + '"]["'.join(l) + '"]'
            try:
                value = eval(key)
                if value == float(item.exp_value):
                    item.is_pass = 1
            except KeyError:
                value = 'NULL'
            except ValueError:
                if value == item.exp_value:
                    item.is_pass = 1
            item.value = value
            if item.is_pass == -1:
                result.is_pass = -1
            item.save()

    except ValueError:
        result.is_pass = -1

    result.save()


class CaseTestView(LoginRequiredView, View):
    def get(self, request, case_id):
        case = Case.objects.filter(id=int(case_id), is_deleted=0)[0]
        env1 = Proj.objects.get(id=1).get_all_env()
        env2 = Proj.objects.get(id=2).get_all_env()
        env3 = Proj.objects.get(id=3).get_all_env()
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
                           "cookies": cookies, "valids": valids,"environments":{"env1":env1,"env2":env2,"env3":env3}})
        else:
            return render(request, 'wrong.html')

    def post(self, request, case_id):
        if not Case.objects.get(id=int(case_id)):
            return JsonResponse({"msg": u"不存在"})
        task_id = request.POST.get("task_id", '')
        env_id = request.POST.get("env",'')
        if task_id:
            task_id = int(task_id)
        else:
            task_id = 0

        if env_id == '':
            return JsonResponse({"status": 1, "message": u"未选择环境"})

        case = Case.objects.get(id=int(case_id))
        if case.validation == '':
            valids = json.loads('{}')
        else:
            valids = json.loads(case.validation)
        try:
            r = test_case(env_id, case)
            result_id = save_result(r, case, task_id, env_id)

        except Exception as e:
            result_id = save_exception(e, case, task_id,env_id)
            result = Result.objects.get(id=int(result_id))
            return JsonResponse({"status": 1, "message": result.desp})

        finally:
            if len(valids.keys()) > 0:
                verify(result_id,valids)
                result = Result.objects.get(id=int(result_id))
                validations = result.get_all_valids()
                vals = list(validations.values("key","exp_value","value","is_pass"))
            else:
                vals = []

        if r.status_code == 200:
            return JsonResponse({"status": 0, "message": u"测试成功",
                                 "result": {"status_code": r.status_code, "url": r.url, "response": r.json(),"count":len(vals),
                                            "vals": vals }})
        else:
            return JsonResponse({"status": 0, "message":u"测试失败","result":{"status_code": r.status_code, "url": r.url, "response": r.text.decode("unicode-escape"),"count":len(vals),
                                            "vals": vals }})
