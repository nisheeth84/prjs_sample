import json
from os import path


def get_event_object(header=None,
                     http_method=None,
                     query_string_parameters=None,
                     path_parameters=None,
                     body=None,
                     email=None,
                     trace_id=None):
    tests_dir = path.dirname(path.abspath(__file__))
    with open(tests_dir + "/event_template.json", "r") as file:
        event = json.load(file)
    if (header):
        event['headers'] = header
    if (http_method):
        event['httpMethod'] = http_method
    if (query_string_parameters):
        event['queryStringParameters'] = query_string_parameters
    if (path_parameters):
        event['pathParameters'] = path_parameters
    if (body):
        event['body'] = body
    if (email):
        event['requestContext']['authorizer']['claims']['email'] = email
    if (trace_id):
        event['requestContext']['authorizer']['claims'][
            'cognito:username'] = trace_id
    return event
