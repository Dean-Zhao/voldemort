"""easyapi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url,include
# from django.contrib import admin
from users.views import LoginView,LogoutView
from api.views import get_projects
import xadmin

urlpatterns = [
    url(r'^admin/', xadmin.site.urls),
    url(r'^api/',include("api.urls",namespace='api')),
    url(r'^login/$',LoginView.as_view(),name="login"),
    url(r'^logout/$',LogoutView.as_view(),name="logout"),
    url(r'^projs/$',get_projects),
    url(r'^plan/',include("task.urls",namespace='plan')),

]

# from django.conf.urls import url,include
# from rest_framework import routers
# from .viewsets import TagViewset,UserViewset,ApiConfigViewset
#
# router = routers.DefaultRouter()
#
# router.register(r'tags',TagViewset)
# router.register(r'apis',ApiConfigViewset)
# router.register(r'users',UserViewset)
#
# urlpatterns = [
#     url(r'^',include(router.urls)),
#     url(r'^api/',include('rest_framework.urls',namespace='rest_framework')),
# ]
