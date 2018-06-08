# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/6/6 下午4:37'

from models import *
from api.models import *
from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic.base import View
from django.contrib.auth.models import User
from api.test_views import test_case,save_result,save_exception
from api.views import get_slice
from users.views import login_required,LoginRequiredView
import json


@login_required
def get_tasks(request):
    if request.method == 'GET':
        return render(request,"plan_tasks.html")
    else:
        return render(request,"403.html")

@login_required
def get_report(request,task_id):
    if request.method == 'GET':
        t = task.objects.get(id=int(task_id))
        data = t.get_values('plan','create_time','user')
        return render(request,"task_report.html",{"task_id":task_id,"data":data})
    else:
        return render(request,"403.html")

@login_required
def task_query(request):
    all_task = task.objects.all().order_by('-update_time')
    sum = all_task.count()
    page = request.GET.get('currPage',1)
    low,high = get_slice(sum,int(page))
    tasks = all_task[low:high]
    data = list( task.get_values("id","plan","create_time","status","runtime_env","user") for task in tasks )
    return JsonResponse({"count": sum, "currentPage": page, "data": data})

@login_required
def get_cases(request,task_id):
    # t = task.objects.filter(id=int(task_id))[0]
    page = request.GET.get("currPage",1)
    all_result = Result.objects.filter(task_id = int(task_id)).order_by('-create_time')
    sum = all_result.count()
    low,high = get_slice(sum,int(page))
    results = all_result[low:high]
    data = list( r.get_values("case_id","case","url","status_code","is_pass","create_time") for r in results )
    return JsonResponse({"count":sum,"currentPage":page,"data":data})

@login_required
def get_result(request,task_id,case_id):
    all_result = Result.objects.filter(task_id = int(task_id)).order_by('-create_time')
    cases = Case.objects.filter(id=int(case_id))
    if not cases:
        return JsonResponse({"status":-1,"data":""})
    case = cases[0]
    res = all_result.filter(case = case)
    if not res:
        return JsonResponse({"status": -1, "data": ""})
    r = res[0]
    validations = r.get_all_valids()
    try:
        resp = json.JSONDecoder().decode(r.response)
        resp_status = 0
    except ValueError:
        resp = r.response
        resp_status = 1

    try:
        headers = json.loads(r.request_headers.replace('\'','"'))
        headers_status = 0
    except ValueError:
        headers = r.request_headers
        headers_status = 1
    vals = list(validations.values("key", "exp_value", "value", "is_pass"))
    return JsonResponse({"status":0,"data":{"response":{"data":resp,"status":resp_status},"request_headers":{"data":headers,"status":headers_status},"validations":vals}})

