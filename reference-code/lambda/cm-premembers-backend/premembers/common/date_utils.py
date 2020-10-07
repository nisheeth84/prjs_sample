import inspect

from pytz import timezone
from datetime import datetime
from premembers.common import common_utils
from dateutil.parser import parse

# FORMAT DATE
PATTERN_YYYYMMDD = "%Y-%m-%d"
PATTERN_YYYYMMDD_SLASH = "%Y/%m/%d"
PATTERN_YYYYMMDDHHMM = "%Y/%m/%d %H:%M"
PATTERN_YYYYMMDDHHMMSS = "%Y-%m-%d %H:%M:%S"
PATTERN_YYYYMMDDHHMMSSF = "%Y-%m-%d %H:%M:%S.%f"
PATTERN_YYYYMMDDTHHMMSS = "%Y-%m-%dT%H:%M:%S"
PATTERN_YYYYMMDDTHHMMSSZ = "%Y-%m-%dT%H:%M:%S%z"
PATTERN_YYYYMMDDTHHMMSSFZ = "%Y-%m-%dT%H:%M:%S.%f%z"

# TIME ZONE
UTC = 'UTC'
ASIA_TOKYO = 'Asia/Tokyo'
LANGUAGE = {
    'ja': {
        'time_zone': ASIA_TOKYO
    },
    'en': {
        'time_zone': UTC
    }
}


def get_current_date_by_format(format):
    now_utc = datetime.now(timezone('UTC'))
    return now_utc.strftime(format)


def toDate(strDate, time_zone=None):
    pm_logger = common_utils.begin_logger(None, __name__,
                                          inspect.currentframe())
    try:
        date = parse(strDate)
        if time_zone is not None:
            date = date.replace(tzinfo=timezone(time_zone))
    except Exception as e:
        raise common_utils.write_log_exception(e, pm_logger)
    return date


def toString(date, format, time_zone=None):
    if time_zone is not None:
        date = date.astimezone(timezone(time_zone))
    return datetime.strftime(date, format)


def get_current_date():
    return datetime.now(timezone('UTC'))


def difference_days(date1, date2):
    remaining_date = date2 - date1
    remaining_days = round(remaining_date.total_seconds() / (24 * 3600), 1)
    return remaining_days


def get_time_zone_by_language(language):
    return LANGUAGE[language]['time_zone']
