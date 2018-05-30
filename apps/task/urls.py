# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/4/16 下午5:08'
from django.conf.urls import url

from .views import *
from api.test_views import CaseTestView

urlpatterns = [
    url(r'^query$', PlanQueryView.as_view(),name="query"),#plan列表搜索
    url(r'^(?P<plan_id>\w+)$', get_plan),
    url(r'^add/$',new_plan),#新建计划step1
    url(r'^(?P<plan_id>\w+)/addCase$',plan_addCase), #新建计划step2
    url(r'^delete/$',plan_delete),#删除计划
    url(r'^(?P<plan_id>\w+)/exec$',TaskView.as_view(),name='execTask'),
    url(r'^(?P<plan_id>\w+)/task$',ExecTask.as_view()),
    url(r'^$',plan_list),
    url(r'^addinfo$',plan_addinfo),
    url(r'^addcase$', plan_addcase),
]