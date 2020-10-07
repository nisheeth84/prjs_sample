from moto.core import BaseBackend
from pytz import timezone
from datetime import datetime

step_functions_client_connect = None


class StepFunctionBackend(BaseBackend):
    def start_execution(stateMachineArn='string',
                        name='string',
                        input='string'):
        now_utc = datetime.now(timezone('UTC'))
        startDate = now_utc.strftime('%Y-%m-%d %H:%M:%S.') + '%03d' % (
            now_utc.microsecond // 1000)
        response = {
            'executionArn': stateMachineArn,
            'name': name,
            'input': input,
            'startDate': startDate
        }
        return response


def client_connect():
    global step_functions_client_connect
    if not step_functions_client_connect:
        step_functions_client_connect = StepFunctionBackend
    return step_functions_client_connect
