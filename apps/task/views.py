# -*- coding=utf-8 -*-
from django.shortcuts import render
from models import *
from api.models import *
from django.http import JsonResponse
from django.views.generic.base import View
from django.contrib.auth.models import User
from api.test_views import *
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
    proj_id = request.POST.get("project",'')

    if proj_id == '' :
        return JsonResponse({"msg": u"模块为空", "status": 1})
    pj = Proj.objects.filter(id=int(proj_id),deleted=0)[0]
    if not pj:
        return JsonResponse({"msg": u"模块错误", "status": 2})
    if name == '':
        return JsonResponse({"msg": u"名称为空", "status": 1})
    elif plan.objects.filter(name=name,is_deleted=0,proj=pj):
        return JsonResponse({"msg":u"名称重复","status":2})
    desp = request.POST.get("desp",'')


    p = plan()
    p.user = request.user
    p.name = name
    p.proj = pj
    p.description = desp
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
        return JsonResponse({"status": -1, "msg": u"请求方式错误！"})
    p = plan.objects.filter(id=int(plan_id), is_deleted=0)
    if not p:
        return JsonResponse({"status": 1, "msg": u"方案不存在!"})
    p = p[0]
    cases = request.body.split('&')
    case_list = [int(l.split('=')[1]) for l in cases]
    for c in case_list:
        try:
            p.cases.add(Case.objects.get(id=c))
        except Exception:
            continue
    return JsonResponse({"status": 0, "msg": u"添加成功！"})


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


@login_required
def get_plan(request,plan_id):
    '''
    获取plan_id计划的属性和计划中的测试用例
    :param request:
    :param plan_id: int
    :return:
    '''
    try:
        p = plan.objects.get(id=int(plan_id),is_deleted=0)
        case_all = p.get_cases()
        page = request.GET.get('currPage', 1)
        sum = len(case_all)
        low, high = get_slice(sum, int(page))
        cases = case_all[low:high]
        if p:
            return JsonResponse({"count": sum, "currentPage": page, "data": cases})
    except Exception as e:
        return JsonResponse({"msg":e.message,"status":-1})

@login_required
def plan_check(request,plan_id):
    if request.method == 'GET':
        #dean 修改渲染界面配置2018-05-30 -- start --
        p = plan.objects.filter(id=int(plan_id),is_deleted=0)
        if p:
            return render(request,"plan_check.html",{"plan":p[0]})
        else:
            return render(request,"404.html")
        #dean 修改渲染界面配置2018-05-30 -- end --
    else:
        return render(request,"403.html")

class PlanQueryView(View):
    def get(self,request):
        sortType = request.GET.get("sortType", "desc")
        pj = int(request.GET.get("project", 0))
        kw = request.GET.get("kw", "")
        page = request.GET.get('currPage', 1)
        userId = int(request.GET.get('userId',0))
        plan_all = plan.objects.filter(is_deleted=0)
        if kw != '':
            plan_all = plan_all.filter(name__contains=kw)
        if sortType == 'desc':
            plan_all = plan_all.order_by("-update_time")
        elif sortType == 'asc':
            plan_all = plan_all.order_by("update_time")
        if userId != 0:
            user = User.objects.filter(id=int(userId))
            if user:
                plan_all = plan_all.filter(user=user[0])

        if pj != 0:
            proj = Proj.objects.filter(id=int(pj), deleted=0)
            if proj:
                plan_all = plan_all.filter(proj=proj[0])
        sum = plan_all.count()
        low, high = get_slice(sum, int(page))
        plans = plan_all[low:high]
        data1 = [i.get_values('id', 'name','proj','task_count','description','status', 'user', 'update_time') for i in plans]
        #dean 传出接口附带task_count 2018-06-01 -- start --
#         for i in range(len(data1)):
#             t = task.objects.filter(plan=int(data1[i]['id']),status=0) 
#             task_cout = t.count()
#             data1[i]['task_count'] = task_cout
        #dean 传出接口附带task_count 2018-06-01 -- end --
        return JsonResponse({"count": sum, "currentPage": page, "data": data1})


def save_task(request,plan_id):
    t = task()
    p = plan.objects.get(id=int(plan_id))
    t.plan = p
    env_id = request.POST.get('run_env','0')
    t.runtime_env = runtime_env.objects.get(id=int(env_id))
    t.status=0
    t.user = request.user
    t.save()
    p.task_count = 1 + p.task_count
    p.save()
    return t.id
    # return JsonResponse({"msg":'sucess','status':0})

def execute_task(task_id):
    t = task.objects.get(id=task_id)
    p = t.plan
    env = t.runtime_env
    for case in p.cases.all():
        if case.validation == '':
            valids = json.loads('{}')
        else:
            valids = json.loads(case.validation)
        try:
            r = test_case(env.id, case)
            result_id = save_result(r, case, task_id, env.id)
            if len(valids.keys()) > 0:
                verify(result_id,valids)
        except Exception as e:
            result_id = save_exception(e, case, task_id,env.id)
            continue
    t.status = 1
    t.save()
    return t.status




class TaskView(LoginRequiredView,View,):
    def post(self,request,plan_id):
        task_id = save_task(request,plan_id)
        p = plan.objects.get(id=int(plan_id))
        status = execute_task(task_id)
        if status == 1:
            return JsonResponse({"status":status,"msg":"sucess"})
        else:
            return JsonResponse({"status":-1,"msg":"wronggit "})

class ExecTask(LoginRequiredView,View):
    def post(self,request,plan_id):
        task_id = save_task(request,plan_id)
        execute.delay(task_id)
        return JsonResponse({"status":"sucess","task_id":task_id})

@login_required
def plan_list(request):
    if request.method == 'GET':
        #dean 修改渲染界面配置2018-06-01 -- start --
        projs = Proj.objects.filter(deleted=0)
        users = User.objects.all()
        envs = runtime_env.objects.filter(is_deleted=0)
        return render(request,"plan_list.html",{"projs":projs,"users":users,"envs":envs})
        #dean 修改渲染界面配置2018-06-01 -- end --
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
        p = plan.objects.get(id=plan_id,is_deleted=0)
        apis = Api.objects.filter(proj=p.proj.id,is_deleted=0)
        tags = Tag.objects.filter(is_deleted=0)
        return render(request,"plan_addcase.html",{"plan_id":plan_id,"projs":p.proj.id,"apis":apis,"tags":tags})
        #dean 修改渲染界面配置2018-05-31 新增渲染plan_id -- end --
    else:
        return render(request,"403.html")

def get_tasks(request,plan_id):
    p = plan.objects.filter(id=int(plan_id))[0]
    all_task = p.get_tasks().order_by('-update_time')
    tasks = [ i.get_values('id','count','count_p','count_f','create_time','status','user','runtime_env') for i in all_task ]
    return JsonResponse({'status':0,'tasks':tasks})


