import boto3
import inspect

from retry import retry
from premembers.common import common_utils
from botocore.exceptions import ClientError
from premembers.repository import dynamodb_endpoint
from premembers.repository import retrycheck
from premembers.exception.pm_exceptions import RetryException, NoRetryException
from boto3.dynamodb.conditions import Attr

dynamodb = None
endpoint_url = None


def connect_dynamodb(table_name):
    global endpoint_url
    global dynamodb
    if not endpoint_url:
        endpoint_url = dynamodb_endpoint.get_endpoint()
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url=endpoint_url)
    return dynamodb.Table(table_name.value)


@retry(RetryException, tries=3, delay=1, backoff=2)
def create(trace_id,
           table_name,
           create_data,
           condition_expression=None,
           is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        table = connect_dynamodb(table_name)
        if (condition_expression is None):
            table.put_item(Item=create_data)
        else:
            table.put_item(Item=create_data,
                           ConditionExpression=condition_expression)
        logger.info(table_name.value + "正常に作成しました。")
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            logger.error(retry_exception)
            logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            logger.error(no_retry_exception)
            raise no_retry_exception


@retry(RetryException, tries=3, delay=1, backoff=2)
def update(trace_id,
           table_name,
           key,
           update_attribute,
           target_update_date=None,
           is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
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
        table = connect_dynamodb(table_name)
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
        logger.info(table_name.value + "を正常に更新しました。")
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            logger.error(retry_exception)
            logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            logger.error(no_retry_exception)
            raise no_retry_exception


@retry(RetryException, tries=3, delay=1, backoff=2)
def delete(trace_id, table_name, key):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        table = connect_dynamodb(table_name)
        table.delete_item(Key=key)
        pm_logger.info(table_name.value + "を削除しました。")
        return True
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            pm_logger.error(retry_exception)
            pm_logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            pm_logger.error(no_retry_exception)
            raise no_retry_exception


@retry(RetryException, tries=3, delay=1, backoff=2)
def query_key(trace_id, table_name, key, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        table = connect_dynamodb(table_name)
        result = table.get_item(Key=key)
        result_item = None
        if (common_utils.check_key('Item', result)):
            result_item = result['Item']
        return common_utils.response(result_item, logger)
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            logger.error(retry_exception)
            logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            logger.error(no_retry_exception)
            raise no_retry_exception


def query(trace_id,
          table_name,
          key_conditions,
          filter_expression,
          is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    exclusiveStartKey = None
    list_data = []
    while True:
        try:
            result = query_db(trace_id,
                              table_name,
                              key_conditions,
                              filter_expression,
                              exclusiveStartKey,
                              is_cw_logger=is_cw_logger)
            list_data.extend(result['Items'])
            if common_utils.check_key('LastEvaluatedKey', result) is False:
                break
            exclusiveStartKey = result['LastEvaluatedKey']
        except Exception as e:
            logger.error(e)
            break
    return common_utils.response(list_data, logger)


@retry(RetryException, tries=3, delay=1, backoff=2)
def query_db(trace_id,
             table_name,
             key_conditions,
             filter_expression,
             exclusiveStartKey=None,
             is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        table = connect_dynamodb(table_name)
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
        return common_utils.response(result, logger)
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            logger.error(retry_exception)
            logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            logger.error(no_retry_exception)
            raise no_retry_exception


def query_index(trace_id,
                table_name,
                index_name,
                key_conditions,
                filter_expression,
                scan_index_forward=True,
                is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    exclusiveStartKey = None
    list_data = []
    while True:
        try:
            result = query_index_db(trace_id,
                                    table_name,
                                    index_name,
                                    key_conditions,
                                    filter_expression,
                                    scan_index_forward,
                                    exclusiveStartKey,
                                    is_cw_logger=is_cw_logger)
            list_data.extend(result['Items'])
            if common_utils.check_key('LastEvaluatedKey', result) is False:
                break
            exclusiveStartKey = result['LastEvaluatedKey']
        except Exception as e:
            logger.error(e)
            break
    return common_utils.response(list_data, logger)


@retry(RetryException, tries=3, delay=1, backoff=2)
def query_index_db(trace_id,
                   table_name,
                   index_name,
                   key_conditions,
                   filter_expression,
                   scan_index_forward=True,
                   exclusiveStartKey=None,
                   is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        table = connect_dynamodb(table_name)
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
        return common_utils.response(result, logger)
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            logger.error(retry_exception)
            logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            logger.error(no_retry_exception)
            raise no_retry_exception


@retry(RetryException, tries=3, delay=1, backoff=2)
def query_count(trace_id, table_name, key_conditions, filter_expression):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        table = connect_dynamodb(table_name)
        if filter_expression:
            result = table.query(
                Select='COUNT',
                KeyConditions=key_conditions,
                FilterExpression=filter_expression)
        else:
            result = table.query(
                Select='COUNT',
                KeyConditions=key_conditions)
        return common_utils.response(result, result['Count'])
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            pm_logger.error(retry_exception)
            pm_logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            pm_logger.error(no_retry_exception)
            raise no_retry_exception


@retry(RetryException, tries=3, delay=1, backoff=2)
def scan(trace_id, table_name, limit, exclusiveStartKey=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        table = connect_dynamodb(table_name)
        if exclusiveStartKey is None:
            result = table.scan(Limit=limit)
        else:
            result = table.scan(
                Limit=limit, ExclusiveStartKey=exclusiveStartKey)
        # return data
        return common_utils.response(result, pm_logger)
    except ClientError as e:
        if retrycheck.check_retryable(e.response):
            retry_exception = RetryException(cause_error=e)
            pm_logger.error(retry_exception)
            pm_logger.exception("error_id: %s", retry_exception.error_id)
            raise retry_exception
        else:
            no_retry_exception = NoRetryException(
                cause_error=e, message=e.response['Error']['Message'])
            pm_logger.error(no_retry_exception)
            raise no_retry_exception
