# -*- coding=utf-8 -*-
from django.shortcuts import render
from models import *
from api.models import *
from django.http import JsonResponse
from django.views.generic.base import View
from django.contrib.auth.models import User
from api.test_views import test_case,save_result,save_exception
from api.views import get_slice
from users.views import login_required,LoginRequiredView
from tasks import execute
# Create your views here.

@login_required
def new_plan(request):
    '''
    新建计划第一步，保存计划属性
    :param request:
    :return:
    '''
    if request.method == 'GET':
        return JsonResponse({"msg":u"请求方式错误","status":-1})
    name = request.POST.get('name','')
    if name == '':
        return JsonResponse({"msg": u"名称为空", "status": 1})
    elif plan.objects.filter(name=name):
        return JsonResponse({"msg":u"名称重复","status":2})
    desp = request.POST.get("description",'')
    proj_id = request.POST.get("project",'')
    if proj_id == '' :
        return JsonResponse({"msg": u"模块为空", "status": 1})
    if not Proj.objects.filter(id=int(proj_id),deleted=0):
        return JsonResponse({"msg": u"模块错误", "status": 2})

    p = plan()
    p.user = request.user
    p.name = name
    p.proj = Proj.objects.get(id=int(proj_id),deleted=0)
    p.desp = desp
    p.save()
    return JsonResponse({"status":0,"data":{"msg":"sucess","plan":p.id}})

@login_required
def plan_addCase(request,plan_id):
    '''
    新建计划第二步，添加测试用例。
    :param request:
    :param plan_id:
    :return:
    '''
    if request.method == 'GET':
        return JsonResponse({"status":-1,"msg":u"请求方式错误！"})
    p = plan.objects.filter(id=int(plan_id),is_deleted=0)
    if not p:
        return JsonResponse({"status":1,"msg":u"方案不存在!"})
    p = p[0]
    case_list = request.POST.get("cases",'')
    if case_list != '':
        l = eval(case_list)
        for c in l:
            try:
                p.cases.add(Case.objects.get(id=c))
            except Exception:
                continue
    return JsonResponse({"status":0,"msg":u"添加成功！"})


@login_required
def plan_delete(request):
    if request.method == 'GET':
        return JsonResponse({"status":-1,"msg":u"请求方式错误！"})
    plan_id = request.POST.get("project","")
    if plan_id == "":
        return JsonResponse({"status":1,"msg":u"计划不存在！"})
    p = plan.objects.filter(id=int(plan_id), is_deleted=0)
    if not p:
        return JsonResponse({"status": 1, "msg": u"计划不存在!"})
    p=p[0]
    p.is_deleted = 1
    p.save()
    return JsonResponse({"status":0,"msg":u"删除成功！"})


# @login_required
def get_plan(request,plan_id):
    '''
    获取plan_id计划的属性和计划中的测试用例
    :param request:
    :param plan_id: int
    :return:
    '''
    try:
        p = plan.objects.get(id=int(plan_id),is_deleted=0)
        cases = p.get_cases()
        if p:
            return JsonResponse({"plan":p.get_values("name","description","user","task_count","create_time"),"cases":cases})
    except Exception as e:
        return JsonResponse({"msg":e.message,"status":0})

class PlanQueryView(View):
    def get(self,request):
        sortType = request.GET.get("sortType", "desc")
        pj = request.GET.get("project", "")
        kw = request.GET.get("kw", "")
        page = request.GET.get('currPage', 1)
        userId = request.GET.get('userId','')
        plan_all = plan.objects.filter(is_deleted=0)
        if kw != '':
            plan_all = plan_all.filter(name__contains=kw)
        if sortType == 'desc':
            plan_all = plan_all.order_by("-update_time")
        elif sortType == 'asc':
            plan_all = plan_all.order_by("update_time")
        if userId != '':
            user = User.objects.filter(id=int(userId))
        if user:
            plan_all = plan_all.filter(user=user[0])
        sum = plan_all.count()
        low, high = get_slice(sum, int(page))
        plans = plan_all[low:high]
        data1 = [i.get_values('id', 'name','proj','description', 'user', 'update_time') for i in plans]
        return JsonResponse({"count": sum, "currentPage": page, "data": data1})





@login_required
def save_task(request,plan_id):
    t = task()
    t.plan = plan.objects.get(id=int(plan_id))
    t.runtime_env = runtime_env.objects.get(id=1)
    t.status=0
    t.user = request.user
    t.save()
    t.plan.task_count += 1
    t.plan.save()
    return t.id
    # return JsonResponse({"msg":'sucess','status':0})

@login_required
def execute_task(task_id):
    t = task.objects.get(id=task_id)
    p = t.plan
    env = t.runtime_env
    for case in p.cases.all():
        try:
            r = test_case(env.id, case)
            save_result(r, case, task_id)
        except Exception as e:
            print "Exception...."
            print e.message
            save_exception(e, case, task_id)
            continue
    t.status = 1
    t.save()
    return t.status

    # except Exception as e2:
    #     print 'e2...'
    #     print e2.message
    #     return -1



class TaskView(View):
    def post(self,request,plan_id):
        task_id = save_task(request,plan_id)
        status = execute_task(task_id)
        return JsonResponse({"status":status})

class ExecTask(View):
    def post(self,request,plan_id):
        task_id = save_task(request,plan_id)
        execute.delay(task_id)
        return JsonResponse({"status":"sucess","task_id":task_id})

@login_required
def plan_list(request):
    if request.method == 'GET':
        #dean 修改渲染界面配置2018-05-30 -- start --
        projs = Proj.objects.filter(deleted=0)
        users = User.objects.all()
        return render(request,"plan_list.html",{"projs":projs,"users":users})
        #dean 修改渲染界面配置2018-05-30 -- end --
    else:
        return render(request,"403.html")


@login_required
def plan_addinfo(request):
    if request.method == 'GET':
        #dean 修改渲染界面配置2018-05-30 -- start --
        projs = Proj.objects.filter(deleted=0)
        return render(request,"plan_addinfo.html",{"projs":projs})
        #dean 修改渲染界面配置2018-05-30 -- end --
    else:
        return render(request,"403.html")


@login_required
def plan_addcase(request,plan_id):
    if request.method == 'GET':
        #dean 修改渲染界面配置2018-05-31 新增渲染plan_id 之后render 用例的时候建议优化下 -- start --
        context = {}
        context['plan_id'] = plan_id
        return render(request,"plan_addcase.html",context)
        #dean 修改渲染界面配置2018-05-31 新增渲染plan_id -- end --
    else:
        return render(request,"403.html")

