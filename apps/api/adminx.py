# -*- coding:utf-8 -*-


import xadmin
from xadmin import views

from .models import *

class BaseSetting(object):
    enable_themes = True
    use_bootswatch = True

class GlobalSettings(object):
    site_title = "后台管理系统"
    site_footer = "XXXX公司"
    menu_style = "accordion"

class ProjAdmin(object):
    list_display = ['name','father_id','create_time']
    search_fields = ['name','father_id','create_time']
    list_filter = ['name','father_id','create_time']

class ApiAdmin(object):
    list_display = ['path','method','name','description','proj','user','update_time']
    search_fields = ['path','method','name','description','proj','user','update_time']
    list_filter = ['path','method','name','description','proj','user','update_time']


class CaseAdmin(object):
    list_display = ['id','name','parameter','api','tag']
    search_fields = ['name','parameter','api','tag']
    list_filter = ['name','parameter','api','tag']

class TagAdmin(object):
    list_display = ['name']
    search_fields = ['name']
    list_filter = ['name']

class ResultAdmin(object):
    list_display = ['case','url','status_code','response']
    search_fields = ['case']
    list_filter = ['case']

xadmin.site.register(Proj,ProjAdmin)
xadmin.site.register(Api,ApiAdmin)
xadmin.site.register(views.BaseAdminView,BaseSetting)
xadmin.site.register(views.CommAdminView,GlobalSettings)
xadmin.site.register(Case,CaseAdmin)
xadmin.site.register(Tag,TagAdmin)
xadmin.site.register(Result,ResultAdmin)
