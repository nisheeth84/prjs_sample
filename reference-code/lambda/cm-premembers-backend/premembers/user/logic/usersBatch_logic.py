import inspect

from premembers.common import common_utils, aws_common
from premembers.exception.pm_exceptions import PmError
from premembers.const.const import CommonConst
from premembers.common import date_utils
from premembers.repository import pm_affiliation


def execute_delete_invalid_user(trace_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # Get Cognito UserPools status UNCONFIRMED
    try:
        list_user_unconfirmed = aws_common.get_cognito_user_pools(
            trace_id,
            CommonConst.COGNITO_STATUS_UNCONFIRMED,
            attribute_filter=CommonConst.ATTRIBUTE_FILTER_USER_STATUS)
    except PmError as e:
        pm_logger.error("[%s]Cognitoユーザー一覧情報取得に失敗しました。",
                        CommonConst.COGNITO_STATUS_UNCONFIRMED)
        raise common_utils.write_log_pm_error(e, pm_logger)

    # get current date
    current_date_time = date_utils.toDate(
        date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS), date_utils.UTC)

    # loop user cognito UserPools status UNCONFIRMED
    for user_unconfirmed in list_user_unconfirmed:
        user_create_date = date_utils.toDate(
            date_utils.toString(user_unconfirmed['UserCreateDate'],
                                date_utils.PATTERN_YYYYMMDDHHMM),
            date_utils.UTC)
        if date_utils.difference_days(
                user_create_date,
                current_date_time) > CommonConst.TERM_USER_UNCONFIRMED_DAY:
            # delete Cognito UserPools status UNCONFIRMED update period greater than 1 days
            try:
                aws_common.delete_cognito_user_by_user_name(
                    trace_id, user_unconfirmed['Username'])
            except PmError as e:
                pm_logger.warning("CognitoでUserName = %sのユーザー削除に失敗しました。",
                                  user_unconfirmed['Username'])
                raise common_utils.write_log_pm_error(e, pm_logger)

    # Get Cognito UserPools status FORCE_CHANGE_PASSWORD
    try:
        list_user_force_change_password = aws_common.get_cognito_user_pools(
            trace_id,
            CommonConst.COGNITO_STATUS_FORCE_CHANGE_PASSWORD,
            attribute_filter=CommonConst.ATTRIBUTE_FILTER_USER_STATUS)
    except PmError as e:
        pm_logger.error("[%s]Cognitoユーザー一覧情報取得に失敗しました。",
                        CommonConst.COGNITO_STATUS_FORCE_CHANGE_PASSWORD)
        raise common_utils.write_log_pm_error(e, pm_logger)

    current_date = date_utils.toDate(
        date_utils.toString(current_date_time,
                            date_utils.PATTERN_YYYYMMDD_SLASH), date_utils.UTC)
    # loop user cognito UserPools status FORCE_CHANGE_PASSWORD
    for user_force_change_password in list_user_force_change_password:
        user_create_date = date_utils.toDate(
            date_utils.toString(user_force_change_password['UserCreateDate'],
                                date_utils.PATTERN_YYYYMMDD_SLASH),
            date_utils.UTC)
        if date_utils.difference_days(
                user_create_date, current_date
        ) > CommonConst.TERM_USER_FORCE_CHANGE_PASSWORD_DAY:
            # get list affiliations
            try:
                affiliations = pm_affiliation.query_userid_key(
                    trace_id, user_force_change_password['Username'])
            except PmError as e:
                pm_logger.warning(
                    "PM_Affiliationテーブルにて、UserID = %sのレコード取得に失敗しました。",
                    user_force_change_password['Username'])
                raise common_utils.write_log_pm_error(e, pm_logger)

            # delete affiliations user status FORCE_CHANGE_PASSWORD update period greater than 6 days
            for affiliation in affiliations:
                try:
                    pm_affiliation.delete_affiliation(
                        affiliation['UserID'], affiliation['OrganizationID'])
                except PmError as e:
                    pm_logger.warning(
                        "PM_Affiliationテーブルのレコード削除に失敗しました。UserID : %s / OrganizationID : %s",
                        affiliation['UserID'], affiliation['OrganizationID'])
                    raise common_utils.write_log_pm_error(e, pm_logger)

            # delete Cognito UserPools status FORCE_CHANGE_PASSWORD update period greater than 6 days
            try:
                aws_common.delete_cognito_user_by_user_name(
                    trace_id, user_force_change_password['Username'])
            except PmError as e:
                pm_logger.warning("CognitoでUserName = %sのユーザー削除に失敗しました。",
                                  user_force_change_password['Username'])
                raise common_utils.write_log_pm_error(e, pm_logger)
