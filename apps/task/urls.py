# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/4/16 下午5:08'
from django.conf.urls import url

from .views import *
from api.test_views import CaseTestView

urlpatterns = [
    # url(r'^plan$', planQueryView.as_view(),name="query"),
    url(r'^(?P<plan_id>\w+)$', get_plan),
    url(r'^add/$',new_plan),
    url(r'^(?P<plan_id>\w+)/exec$',TaskView.as_view(),name='execTask'),
    url(r'^(?P<plan_id>\w+)/task$',ExecTask.as_view()),
]