import inspect
import calendar

from datetime import datetime
from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr


def create_daily_check(trace_id, awsaccount):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    now_utc = datetime.utcnow()
    date_format = now_utc.strftime("%Y-%m-%d")
    unixtime = calendar.timegm(now_utc.utctimetuple())
    ttl = 60 * 60 * 24 * 3
    create_daily_check = {
        "AWSAccount": awsaccount,
        'ExecutedDate': date_format,
        'TTL': unixtime + ttl
    }
    condition_expression = Attr("AWSAccountID").not_exists().__and__(
        Attr("ExecutedDate").not_exists())
    DB_utils.create(trace_id, Tables.PM_DAILY_CHECK_EXECUTED_AWSACCOUNTS,
                    create_daily_check, condition_expression)


def query_daily_check_key(trace_id, awsaccount, executed_date):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'AWSAccount': {
            'AttributeValueList': [awsaccount],
            'ComparisonOperator': 'EQ'
        }
    }
    key_conditions['ExecutedDate'] = {
        'AttributeValueList': [executed_date],
        'ComparisonOperator': 'EQ'
    }

    result = DB_utils.query(trace_id,
                            Tables.PM_DAILY_CHECK_EXECUTED_AWSACCOUNTS,
                            key_conditions, None)
    return common_utils.response(result, pm_logger)


def query_check_count(trace_id, awsaccount, executed_date):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    result = query_daily_check_key(trace_id, awsaccount, executed_date)
    return common_utils.response(len(result), pm_logger)
