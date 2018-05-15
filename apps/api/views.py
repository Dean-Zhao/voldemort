# -*- coding:utf-8 -*-
import json

from users.views import login_required,LoginRequiredView
from django.shortcuts import render
from django.views.generic.base import View
from django.http import JsonResponse,HttpResponse
from .forms import *
from .models import  Api,Tag,Case,Proj
from django.contrib.auth.models import User


# Create your views here.

PER_PAGE_COUNT=10

# @login_required #todo
def api_list(request):
    '''
    api列表渲染页面
    :param request:
    :return:
    '''
    if request.method == 'GET':
        projs = Proj.objects.filter(deleted=0)
        apis = Api.objects.filter(is_deleted=0).order_by('-update_time')
        return render(request,'api_list.html',{"projs":projs,"apis":apis}) #todo

@login_required #todo
def edit_api(request,api_id):
    '''
    api编辑渲染页面
    :param request:
    :return:
    '''
    if request.method == 'GET':
        api = Api.objects.get(id=int(api_id))
        projs = Proj.objects.filter(deleted=0).order_by("id")
        return render(request,'api_edit.html',{"api":api,'projs':projs})


def saveParam(parameter):
    '''
    将para1=data1&para2=data2转成{"para1":"data1","para2":"data2"}
    :param parameter:
    :return: string
    '''
    if parameter:
        plist = parameter.split('&')
        data = {}
        for p in plist:
            l = p.split('=')
            data[l[0]] = l[1]
        return data

def get_projects(request):
    if request.method == 'GET':
        proj = Proj.objects.filter(deleted=0)
        sum = proj.count()
        return JsonResponse(dict(count=sum,projs=list(proj.values('id', 'name'))))

    else:
        return JsonResponse({})

def get_slice(count,page):
    '''
    根据页码，返回QuerySet对应页码的切片区间
    :param count: 需要分页的总数目
    :param page: 页码
    :return: lowpos,highpos
    '''
    max = count/PER_PAGE_COUNT+1 if count%PER_PAGE_COUNT else count/PER_PAGE_COUNT
    lowpos = PER_PAGE_COUNT*(page-1)
    if page>0 and page<max:
        highpos = lowpos+10
    elif page == max:
        highpos=count
    else:
        lowpos = highpos = count

    return (lowpos,highpos)

class ApiView(View):
    def get(self,request,api_id):
        api = Api.objects.get(id=int(api_id))
        cases = api.get_all_case()
        allcase = list(api.get_all_case().values("id","name","headers","cookies","parameter"))
        data = {"status":0,"api":{"path":api.path,"method":api.method,"name":api.name,"description":api.description}}
        data["cases"]=allcase
        return JsonResponse(data)

class ApiNewView(View): #todo 添加权限验证
    def get(self,request):
        projs = Proj.objects.all()
        return render(request,"api_add.html",{"user":request.user,"projs":projs})

    def post(self,request):
        '''
        新建／保存api
        :param request:
        :return:
        '''
        api_form = ApiForm(request.POST)
        if api_form.is_valid():
            api_path = request.POST.get("path","")
            api_name = request.POST.get("name","")
            proj_id = request.POST.get("project","")
            project = Proj.objects.get(id=int(proj_id))
            api_method = request.POST.get("method", "")
            api_description = request.POST.get("description", "")
            api_id = int(request.POST.get("api_id",-1))

            if api_id != -1:
                if Api.objects.filter(path=api_path,proj=project).exclude(id=api_id):
                    return JsonResponse({"msg":u"该api已存在","status":1})
                api = Api.objects.filter(id=int(request.POST.get("api_id")),is_deleted=0)[0]
                if not api:
                    return JsonResponse({"msg":u"该api不存在","status":2})
            elif Api.objects.filter(path=api_path,proj=project):
                    return JsonResponse({"msg":u"该api已存在","status":1})
            else:
                api = Api()
            api.description = api_description
            api.path = api_path
            api.method = api_method.lower()
            api.name = api_name
            api.proj = project
            api.user = request.user
            # api.user = User.objects.get(id=1) #todo 注释
            try:
                api.save()
                return JsonResponse({"msg":u"保存成功","status":0})
            except Exception:
                return JsonResponse({"msg":u"保存失败","status":-1})
        else:
            return JsonResponse({"msg":u"验证失败","status":3})

class ApiQueryView(View):
    def get(self,request):
        api_all = Api.objects.filter(is_deleted=0)
        count = Api.objects.count()
        sortType = request.GET.get("sortType","desc")
        pj = request.GET.get("project","")
        kw = request.GET.get("kw","")
        page = request.GET.get('currPage',1)
        if pj!= "":
            proj = Proj.objects.get(id=int(pj))
            apis = api_all.filter(proj=proj)
        else:
            apis = api_all
        if sortType == 'desc':
            apis = apis.order_by("-update_time")
        elif sortType == 'asc':
            apis = apis.order_by("update_time")
        if kw:
            apis = apis.filter(name__contains=kw)
        sum = apis.count()
        low,high = get_slice(count,int(page))
        apis = apis[low:high]
        data1 = [ i.get_values('id','name','path','method','description','proj','user','update_time') for i in apis]
        return JsonResponse({"count":sum,"currentPage":page,"data":data1})


def data_list(request):
    apiId = request.GET.get("apiId", "")
    api = Api.objects.get(id=apiId)
    result = {"status":0,"message":u"获取api列表成功"}
    result["data"]=dict(list=list(Case.objects.filter(api=api).values('id','name','parameter')))
    return JsonResponse(result)


class CaseNewView(LoginRequiredView,View): #todo 增加权限LoginRequiredView
    def get(self,request,api_id):
        tags = Tag.objects.filter(is_deleted=0)
        api = Api.objects.filter(id=int(api_id),is_deleted=0)
        if api:
            apis = api[0].get_values("id", "name", "path", "method", "proj","description")
            #此处获取tag_id# 并渲染至界面，界面先默认传1/2，用例类型数据默认为： api接口：101，其他102
            return render(request,'api_testcase_add.html',{"api":apis,"tags":tags})
        else:
            return render(request,'wrong.html')

    def post(self,request):
        data = json.loads(request.body)
        case_form = False
        if data["profile"]["case_name"] and data["api_id"]!=0:
            case_form = True
        if case_form:
            case_name = str(data["profile"]["case_name"])
            api_id = data["api_id"]
            if not Api.objects.filter(id=int(api_id),is_deleted=0):
                return JsonResponse({"msg":u"该api不存在","status":1})
            case_headers = json.dumps(data["headers"])
            case_cookies = json.dumps(data["cookies"])
            case_api = Api.objects.get(id=int(api_id))
            case_validation = json.dumps(data["validations"])
            case_parameter = json.dumps(data["parameters"])
            case_tag_id = int(data["profile"]["case_type"])
            if data["profile"].has_key("case_enctype"):
                case_encryption_type = int(data["profile"]["case_enctype"])
            else:
                case_encryption_type = 0
            if data.has_key("case_id"):
                case_id = int(data["case_id"])
            else:
                case_id = 0
            if  case_id != 0: #修改已存在的case
                if Case.objects.filter(name=case_name,api=case_api).exclude(id=case_id):
                    return JsonResponse({"msg":u"该用例已存在","status":2})
                case = Case.objects.filter(id=case_id,is_deleted=0)[0]
                if not case:
                    return JsonResponse({"msg":u"该用例不存在","status":3})
            else:
                if Case.objects.filter(name=case_name,api=case_api):
                    return JsonResponse({"msg":u"该用例已存在","status":2})
                case = Case()
            case.name = case_name
            case.user = request.user
            case.api = case_api
            case.headers = case_headers
            case.cookies = case_cookies
            case.validation = case_validation
            case.parameter = case_parameter
            case.encryption_type = case_encryption_type
            if case_tag_id!=0:
                case_tag=Tag.objects.get(id=int(case_tag_id))
                case.tag = case_tag
            try:
                case.save()
                return JsonResponse({"msg":u"保存用例成功","status":0})
            except Exception:
                return JsonResponse({"msg":u"保存用例失败","status":-1})

        else:
            return JsonResponse({"msg":u"校验失败","status":4})

@login_required
def get_testcases(request,api_id):
    if request.method == 'GET':
        api = Api.objects.filter(id=int(api_id),is_deleted=0)
        if api:
            apis = api[0].get_values("id", "name", "path", "method", "proj","description")
            return render(request,'api_testcase.html',{"api":apis})
        else:
            return render(request,'wrong.html')

@login_required
def get_caseslist(request):
    if request.method == 'GET':
        api_id = request.GET.get("id",'')
        if api_id is None:
            return render(request,'wrong.html')
        api = Api.objects.filter(id=int(api_id),is_deleted=0)
        if api:
            cases = [ i.get_values("id",'name','tag','headers','cookies','parameter','user','update_time','validation') for i in api[0].get_all_case() ]
            return JsonResponse({"cases": cases})
        else:
            return render(request,'wrong.html')


# @login_required
def get_tags(request):
    return JsonResponse(dict(data=list(Tag.objects.filter(is_deleted=0).order_by("id").values('id','name'))))


@login_required
def get_case(request,case_id):
    if request.method != 'GET':
        return render(request,'wrong.html')
    case = Case.objects.filter(id=int(case_id),is_deleted=0)[0]
    if case:
        api = case.api
        tags = Tag.objects.filter(is_deleted=0).order_by("id")
        if case.parameter == '':
            para = json.loads('{}')
        else:
            para = json.loads(case.parameter)
        para_count = len(para.keys())
        if case.headers == '':
            headers = json.loads('{}')
        else:
            headers = json.loads(case.headers)
        headers_count = len(headers.keys())
        if case.cookies == '':
            cookies = json.loads('{}')
        else:
            cookies = json.loads(case.cookies)
        cookies_count = len(cookies.keys())
        if case.validation == '':
            valids = json.loads('{}')
        else:
            valids = json.loads(case.validation)
        valids_count = len(valids.keys())

        counts={}
        counts["para_count"]=para_count
        counts["headers_count"]=headers_count
        counts["cookies_count"]=cookies_count
        counts["valids_count"]=valids_count



        return render(request,'api_testcase_edit.html',{"api":api,"tags":tags,"case":case,"counts":counts,"para":para,"headers":headers,"cookies":cookies,"valids":valids})
    else:
        return render(request, 'wrong.html')




