# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/2/26 下午10:33'
from django.conf.urls import url

from .views import *
from .test_views import CaseTestView

urlpatterns = [
    url(r'^apis$', ApiQueryView.as_view(),name="query" ),
    url(r'^apiList/$',api_list,name="api_list"),
    # url(r'^(?P<api_id>\w+)/addCase$',CaseNewView.as_view(),name="addcase"),
    #dean 修改接口用例界面配置2018-05-07 -- start --
    url(r'(?P<api_id>\w+)/cases/$',get_testcases),
    url(r'^caselist$',get_caseslist),
    #dean 修改接口用例界面配置2018-05-07 -- end --
    url(r'^cases$',data_list),
    url(r'^(?P<api_id>\w+)$',ApiView.as_view(),name="api"),
    url(r'^addApi/$',ApiNewView.as_view(),name="addapi"),
    url(r'(?P<api_id>\w+)/edit/',edit_api,name='edit_api'),
    url(r'^cases/(?P<case_id>\w+)/',get_case),
    url(r'^casetest/(?P<case_id>\w+)/$',CaseTestView.as_view(),name="doTest"),
    url(r'^(?P<api_id>\w+)/addTestCase$',CaseNewView.as_view(),name="addTestCase"),
    url(r'^addCase/$',CaseNewView.as_view(),name="addCase"),
    url(r'^tags/$',get_tags),

]
