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

class planAdmin(object):
    list_display = ['id','name','description','cases','create_time']
    search_fields = ['name','create_time']
    list_filter = ['name','create_time']

class runtime_envAdmin(object):
    list_display = ['id','name','uri','Proj','app_id','token_id','is_deleted']

class taskAdmin(object):
    list_display = ['id','plan','status','runtime_env']

xadmin.site.register(plan,planAdmin)
xadmin.site.register(runtime_env,runtime_envAdmin)
xadmin.site.register(task,taskAdmin)