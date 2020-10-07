import boto3
import json
from os import path

from premembers.common import common_utils
from boto3.dynamodb.conditions import Attr

dynamodb_resource_connect = None
dynamodb_client_connect = None


def resource_connect():
    global dynamodb_resource_connect
    if not dynamodb_resource_connect:
        dynamodb_resource_connect = boto3.resource(
            'dynamodb',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return dynamodb_resource_connect


def client_connect():
    global dynamodb_client_connect
    if not dynamodb_client_connect:
        dynamodb_client_connect = boto3.client(
            'dynamodb',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return dynamodb_client_connect


def create_table(script):
    try:
        dynamodb = resource_connect()
        dynamodb.create_table(**script)
    except Exception as e:
        raise e


def delete_table(table_name):
    params = {'TableName': table_name}
    try:
        dynamodb = resource_connect()
        dynamodb.delete_table(**params)
    except Exception as e:
        raise e


def check_table_exist(table_name):
    try:
        dynamodb = client_connect()
        existing_tables = dynamodb.list_tables()['TableNames']
    except Exception as e:
        raise e
    if table_name in existing_tables:
        return True
    return False


def create(table_name, create_data, condition_expression=None):
    try:
        table = resource_connect().Table(table_name.value)
        if (condition_expression is None):
            table.put_item(Item=create_data)
        else:
            table.put_item(
                Item=create_data, ConditionExpression=condition_expression)
    except Exception as e:
        raise e


def get_script_json_create_table(table_name):
    path_ddl_script = "\\ddl\\{table_name}.json".format(table_name=table_name)
    tests_dir = path.dirname(path.abspath(__file__))
    with open(tests_dir + path_ddl_script, "r") as file:
        script = json.load(file)

    return script


def update(table_name,
           key,
           update_attribute,
           target_update_date=None):
    date_now = common_utils.get_current_date()
    update_attribute['UpdatedAt'] = {'Value': date_now}
    update_expression = 'SET '
    update_expression_attribute_values = {
        ':UpdatedAt': update_attribute['UpdatedAt']['Value']
    }
    first_row = True
    for update_key in update_attribute.keys():
        update_value_key = ":{}".format(update_key)
        update_value = " {} = {}".format(update_key, update_value_key)
        if (first_row):
            update_expression += update_value
            first_row = False
        else:
            update_expression += ", {}".format(update_value)
        update_expression_attribute_values[
            update_value_key] = update_attribute[update_key]['Value']
    condition_expression = Attr('UpdatedAt').eq(target_update_date)
    try:
        table = resource_connect().Table(table_name.value)
        if target_update_date:
            table.update_item(
                Key=key,
                ExpressionAttributeValues=update_expression_attribute_values,
                UpdateExpression=update_expression,
                ConditionExpression=condition_expression)
        else:
            table.update_item(
                Key=key,
                ExpressionAttributeValues=update_expression_attribute_values,
                UpdateExpression=update_expression)
    except Exception as e:
        raise e


def delete(table_name, key):
    try:
        table = resource_connect().Table(table_name.value)
        table.delete_item(Key=key)
        return True
    except Exception as e:
        raise e


def query_key(table_name, key):
    try:
        table = resource_connect().Table(table_name.value)
        result = table.get_item(Key=key)
        result_item = None
        if (common_utils.check_key('Item', result)):
            result_item = result['Item']
        return result_item
    except Exception as e:
        raise e


def query(table_name, key_conditions, filter_expression):
    exclusiveStartKey = None
    list_data = []
    while True:
        try:
            result = query_db(table_name, key_conditions,
                              filter_expression, exclusiveStartKey)
            list_data.extend(result['Items'])
            if common_utils.check_key('LastEvaluatedKey', result) is False:
                break
            exclusiveStartKey = result['LastEvaluatedKey']
        except Exception as e:
            raise e
            break
    return list_data


def query_db(table_name,
             key_conditions,
             filter_expression,
             exclusiveStartKey=None):
    try:
        table = resource_connect().Table(table_name.value)
        if exclusiveStartKey is None:
            if filter_expression:
                result = table.query(
                    KeyConditions=key_conditions,
                    FilterExpression=filter_expression)
            else:
                result = table.query(KeyConditions=key_conditions)
        else:
            if filter_expression:
                result = table.query(
                    KeyConditions=key_conditions,
                    FilterExpression=filter_expression,
                    ExclusiveStartKey=exclusiveStartKey)
            else:
                result = table.query(
                    KeyConditions=key_conditions,
                    ExclusiveStartKey=exclusiveStartKey)
        # return data
        return result
    except Exception as e:
        raise e


def query_index(table_name,
                index_name,
                key_conditions,
                filter_expression,
                scan_index_forward=True):
    exclusiveStartKey = None
    list_data = []
    while True:
        try:
            result = query_index_db(table_name, index_name,
                                    key_conditions, filter_expression,
                                    scan_index_forward, exclusiveStartKey)
            list_data.extend(result['Items'])
            if common_utils.check_key('LastEvaluatedKey', result) is False:
                break
            exclusiveStartKey = result['LastEvaluatedKey']
        except Exception as e:
            raise e
            break
    return list_data


def query_index_db(table_name,
                   index_name,
                   key_conditions,
                   filter_expression,
                   scan_index_forward=True,
                   exclusiveStartKey=None):
    try:
        table = resource_connect().Table(table_name.value)
        if exclusiveStartKey is None:
            if filter_expression:
                result = table.query(
                    IndexName=index_name,
                    KeyConditions=key_conditions,
                    FilterExpression=filter_expression,
                    ScanIndexForward=scan_index_forward)
            else:
                result = table.query(
                    IndexName=index_name,
                    KeyConditions=key_conditions,
                    ScanIndexForward=scan_index_forward)
        else:
            if filter_expression:
                result = table.query(
                    IndexName=index_name,
                    KeyConditions=key_conditions,
                    FilterExpression=filter_expression,
                    ExclusiveStartKey=exclusiveStartKey,
                    ScanIndexForward=scan_index_forward)
            else:
                result = table.query(
                    IndexName=index_name,
                    KeyConditions=key_conditions,
                    ExclusiveStartKey=exclusiveStartKey,
                    ScanIndexForward=scan_index_forward)
        # return data
        return result
    except Exception as e:
        raise e


def query_count(table_name, key_conditions, filter_expression):
    try:
        table = resource_connect().Table(table_name.value)
        if filter_expression:
            result = table.query(
                Select='COUNT',
                KeyConditions=key_conditions,
                FilterExpression=filter_expression)
        else:
            result = table.query(Select='COUNT', KeyConditions=key_conditions)
        return common_utils.response(result, result['Count'])
    except Exception as e:
        raise e


def scan(table_name, limit, exclusiveStartKey=None):
    try:
        table = resource_connect().Table(table_name.value)
        if exclusiveStartKey is None:
            result = table.scan(Limit=limit)
        else:
            result = table.scan(
                Limit=limit, ExclusiveStartKey=exclusiveStartKey)
        # return data
        return result
    except Exception as e:
        raise e
