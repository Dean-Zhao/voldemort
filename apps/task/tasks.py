from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .models import *
from api.test_views import save_result,test_case,save_exception

@shared_task
def execute(task_id):
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