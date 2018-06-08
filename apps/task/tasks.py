from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .models import *
from api.test_views import *
import json
from api.models import *

@shared_task
def execute(task_id):
    t = task.objects.get(id=int(task_id))
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
                verify(result_id, valids)
        except Exception as e:
            result_id = save_exception(e, case, task_id, env.id)
            continue

    t.status = 1
    t.save()
    return t.status
