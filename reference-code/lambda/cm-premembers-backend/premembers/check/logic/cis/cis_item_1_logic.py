import inspect
import csv
import jmespath

from premembers.common import FileUtils, date_utils
from premembers.common import common_utils, aws_common, Ec2Utils
from premembers.repository.const import CheckResult, Members
from premembers.repository.const import RegionName, ResourceType
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError, PmNotificationError
from premembers.common import IAMUtils
from premembers.check.logic.cis import cis_item_common_logic


def check_cis_item_1_01(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        members):
    if members == Members.Enable:
        return CheckResult.MembersManagement
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        credential_report = get_credential_report(
            trace_id, check_history_id, organization_id, project_id,
            awsaccount, session, result_json_path)

        # チェック結果
        check_results = []
        try:
            current_date = date_utils.toDate(
                date_utils.get_current_date_by_format(
                    date_utils.PATTERN_YYYYMMDDTHHMMSSZ))
            reader = csv.DictReader(credential_report.splitlines())
            for row in reader:
                if row['user'] == CommonConst.ROOT_ACCOUNT:
                    login_console_days = convertDateToDays(
                        row['password_last_used'], current_date)
                    access_key_1_days = convertDateToDays(
                        row['access_key_1_last_used_date'], current_date)
                    access_key_2_days = convertDateToDays(
                        row['access_key_2_last_used_date'], current_date)

                    # 過去2週間以内に利用履歴があるrootアカウントは存在するか
                    if (login_console_days <= 14 or access_key_1_days <= 14 or
                            access_key_2_days <= 14):
                        check_result = get_check_cis_item_1_01_result(
                            row['password_last_used'],
                            row['access_key_1_last_used_date'],
                            row['access_key_2_last_used_date'])
                        check_results.append(check_result)
                    break
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_01.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_01',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def get_check_cis_item_1_01_result(password_last_used,
                                   access_key_1_last_used_date,
                                   access_key_2_last_used_date):
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'UseRootAccountAbnormity': True,
            'PasswordLastUsed': formatDate(password_last_used),
            'AccessKey1LastUsedDate': formatDate(access_key_1_last_used_date),
            'AccessKey2LastUsedDate': formatDate(access_key_2_last_used_date)
        }
    }
    return result


def check_cis_item_1_02(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        credential_report = get_credential_report(
            trace_id, check_history_id, organization_id, project_id, awsaccount,
            session, result_json_path)

        # チェック結果
        abnormality_users = []
        try:
            reader = csv.DictReader(credential_report.splitlines())
            for row in reader:
                # check excluded resources
                if common_utils.check_excluded_resources(
                        check_item_code, RegionName.Global,
                        ResourceType.User, row['user'],
                        excluded_resources):
                    continue

                if (row['password_enabled'] == 'true' and
                row['mfa_active'] == 'false'):
                    abnormality_users.append(row['user'])
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_02.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount':
                awsaccount,
                'CheckResults': [{
                    'Region': 'Global',
                    'Level': CommonConst.LEVEL_CODE_21,
                    'DetectionItem': {
                        'AbnormalityUsers': abnormality_users
                    }
                }],
                'DateTime':
                current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(abnormality_users) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_03(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        credential_report = get_credential_report(
            trace_id, check_history_id, organization_id, project_id,
            awsaccount, session, result_json_path)

        # チェック結果
        check_results = []
        try:
            current_date = date_utils.toDate(
                date_utils.get_current_date_by_format(
                    date_utils.PATTERN_YYYYMMDDTHHMMSS))
            reader = csv.DictReader(credential_report.splitlines())
            for row in reader:
                # check excluded resources
                if common_utils.check_excluded_resources(
                        check_item_code, RegionName.Global,
                        ResourceType.User, row['user'],
                        excluded_resources):
                    continue

                # Difference Password Last Used
                login_console_days = 0
                if row['password_enabled'] == 'true':
                    if (row['password_last_used'] == CommonConst.NO_INFORMATION):
                        password_last_changed = date_utils.toDate(
                            row['password_last_changed'][:-6])
                        login_console_days = date_utils.difference_days(
                            password_last_changed, current_date)
                    else:
                        password_last_used = date_utils.toDate(
                            row['password_last_used'][:-6])
                        login_console_days = date_utils.difference_days(
                            password_last_used, current_date)

                # Difference Access Key 1 Last Used Date
                access_key_1_days = 0
                if row['access_key_1_active'] == 'true':
                    if (row['access_key_1_last_used_date'] == CommonConst.NA):
                        access_key_1_last_rotated = date_utils.toDate(
                            row['access_key_1_last_rotated'][:-6])
                        access_key_1_days = date_utils.difference_days(
                            access_key_1_last_rotated, current_date)
                    else:
                        access_key_1_last_used_date = date_utils.toDate(
                            row['access_key_1_last_used_date'][:-6])
                        access_key_1_days = date_utils.difference_days(
                            access_key_1_last_used_date, current_date)

                # Difference Access Key 2 Last Used Date
                access_key_2_days = 0
                if row['access_key_2_active'] == 'true':
                    if (row['access_key_2_last_used_date'] == CommonConst.NA):
                        access_key_2_last_rotated = date_utils.toDate(
                            row['access_key_2_last_rotated'][:-6])
                        access_key_2_days = date_utils.difference_days(
                            access_key_2_last_rotated, current_date)
                    else:
                        access_key_2_last_used_date = date_utils.toDate(
                            row['access_key_2_last_used_date'][:-6])
                        access_key_2_days = date_utils.difference_days(
                            access_key_2_last_used_date, current_date)

                # Check-1. 90日以上利用されていないコンソールログインパスワードは存在するか
                check_1 = login_console_days >= 90

                # Check-2. 90日以上利用されていないアクセスキーは存在するか
                check_2 = access_key_1_days >= 90 or access_key_2_days >= 90

                # どちらか該当するアクセスキーが存在すればこの資格情報は「異常」
                if check_1 is True or check_2 is True:
                    check_result = get_credential_report_result(
                        row, check_1, check_2)
                    check_results.append(check_result)
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_03.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def get_credential_report_result(row, check_1, check_2):
    detection_item = {'User': row['user']}
    if check_1 is True:
        detection_item["PasswordLastUsedAbnormity"] = True
    if check_2 is True:
        detection_item["AcceseKeyAbnormity"] = True
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def check_cis_item_1_04(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        credential_report = get_credential_report(
            trace_id, check_history_id, organization_id, project_id,
            awsaccount, session, result_json_path)

        # チェック結果
        check_results = []
        try:
            current_date = date_utils.toDate(
                date_utils.get_current_date_by_format(
                    date_utils.PATTERN_YYYYMMDDTHHMMSS))
            reader = csv.DictReader(credential_report.splitlines())
            for row in reader:
                # check excluded resources
                if common_utils.check_excluded_resources(
                        check_item_code, RegionName.Global,
                        ResourceType.User, row['user'],
                        excluded_resources):
                    continue

                access_key_1_last_rotated_days = 0
                if row['access_key_1_active'] == 'true':
                    # Difference access_key_1_last_rotated
                    if row['access_key_1_last_rotated'] == CommonConst.NA:
                        access_key_1_last_rotated_days = 999
                    else:
                        access_key_1_last_rotated = date_utils.toDate(
                            row['access_key_1_last_rotated'][:-6])
                        access_key_1_last_rotated_days = date_utils.difference_days(
                            access_key_1_last_rotated, current_date)

                access_key_2_last_rotated_days = 0
                if row['access_key_2_active'] == 'true':
                    # Difference access_key_2_last_rotated
                    if (row['access_key_2_last_rotated'] == CommonConst.NA):
                        access_key_2_last_rotated_days = 999
                    else:
                        access_key_2_last_rotated = date_utils.toDate(
                            row['access_key_2_last_rotated'][:-6])
                        access_key_2_last_rotated_days = date_utils.difference_days(
                            access_key_2_last_rotated, current_date)

                # Check-1. 90日以上ローテーションされていないアクセスキーは存在するか
                check_1 = (access_key_1_last_rotated_days >= 90
                           or access_key_2_last_rotated_days >= 90)

                # Check-1に該当するアクセスキーが存在すればこの資格情報は「異常」とする
                if check_1 is True:
                    check_result = get_check_cis_item_1_04_result(row, check_1)
                    check_results.append(check_result)
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_04.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def get_check_cis_item_1_04_result(row, check_1):
    detection_item = {'User': row['user']}
    if check_1 is True:
        detection_item["AcceseKeyRotatedAbnormity"] = True
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def check_cis_item_1_05(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'RequireUppercaseCharactersAbnormity': True
        }
    }

    try:
        # チェック結果
        try:
            account_password_policy = get_account_password_policy(
                trace_id, check_history_id, organization_id, project_id,
                awsaccount, session, result_json_path)
            if account_password_policy['RequireUppercaseCharacters'] is False:
                check_results.append(result)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_ENTITY:
                check_results.append(result)
            else:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
                raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_05.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_password_policy = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_password_policy,
                                result_json_path, True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_05',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_06(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'RequireLowercaseCharactersAbnormity': True
        }
    }

    try:
        # チェック結果
        try:
            account_password_policy = get_account_password_policy(
                trace_id, check_history_id, organization_id, project_id,
                awsaccount, session, result_json_path)
            if account_password_policy['RequireLowercaseCharacters'] is False:
                check_results.append(result)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_ENTITY:
                check_results.append(result)
            else:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
                raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_06.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_password_policy = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_password_policy,
                                result_json_path, True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_06',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_07(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'RequireSymbolsAbnormity': True
        }
    }

    try:
        # チェック結果
        try:
            account_password_policy = get_account_password_policy(
                trace_id, check_history_id, organization_id, project_id,
                awsaccount, session, result_json_path)
            if account_password_policy['RequireSymbols'] is False:
                check_results.append(result)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_ENTITY:
                check_results.append(result)
            else:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
                raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_07.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_07',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_08(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'RequireNumbersAbnormity': True
        }
    }

    try:
        # チェック結果
        try:
            account_password_policy = get_account_password_policy(
                trace_id, check_history_id, organization_id, project_id,
                awsaccount, session, result_json_path)
            if account_password_policy['RequireNumbers'] is False:
                check_results.append(result)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_ENTITY:
                check_results.append(result)
            else:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
                raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_08.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_08',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_09(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    check_result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'MinimumPasswordLengthAbnormity': True
        }
    }

    try:
        # チェック結果
        try:
            account_password_policy = get_account_password_policy(
                trace_id, check_history_id, organization_id, project_id,
                awsaccount, session, result_json_path)
            if (account_password_policy['MinimumPasswordLength'] < 14):
                check_results.append(check_result)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_ENTITY:
                check_result['DetectionItem'][
                    'MinimumPasswordLengthAbnormity'] = CommonConst.NA
                check_results.append(check_result)
            else:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
                raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_09.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_09',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_10(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    check_result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'PasswordReusePreventionAbnormity': CommonConst.NA
        }
    }

    try:
        # チェック結果
        try:
            account_password_policy = get_account_password_policy(
                trace_id, check_history_id, organization_id, project_id,
                awsaccount, session, result_json_path)
            if (common_utils.check_key('PasswordReusePrevention',
                                       account_password_policy) is False):
                check_results.append(check_result)
            elif (account_password_policy['PasswordReusePrevention'] !=
                  CommonConst.MAX_PASSWORD_REUSE_PREVENTION):
                check_result['DetectionItem'][
                    'PasswordReusePreventionAbnormity'] = account_password_policy[
                        'PasswordReusePrevention']
                check_results.append(check_result)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_ENTITY:
                check_results.append(check_result)
            else:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
                raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_10.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            cis_item_1_10 = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, cis_item_1_10, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_10',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_11(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    check_result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'MaxPasswordAgeAbnormity': CommonConst.NA
        }
    }

    try:
        # チェック結果
        try:
            account_password_policy = get_account_password_policy(
                trace_id, check_history_id, organization_id, project_id,
                awsaccount, session, result_json_path)
            if (common_utils.check_key('MaxPasswordAge',
                                       account_password_policy) is False):
                check_results.append(check_result)
            elif (account_password_policy['MaxPasswordAge'] >
                  CommonConst.MAX_PASSWORD_AGE):
                check_result['DetectionItem'][
                    'MaxPasswordAgeAbnormity'] = account_password_policy[
                        'MaxPasswordAge']
                check_results.append(check_result)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_ENTITY:
                check_results.append(check_result)
            else:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
                raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_11.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            cis_item_1_11 = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, cis_item_1_11, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_11',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_12(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        members):
    if members == Members.Enable:
        return CheckResult.MembersManagement
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        credential_report = get_credential_report(
            trace_id, check_history_id, organization_id, project_id,
            awsaccount, session, result_json_path)

        # チェック結果
        check_results = []
        try:
            reader = csv.DictReader(credential_report.splitlines())
            for row in reader:
                if row['user'] == CommonConst.ROOT_ACCOUNT:
                    # アクセスキーが設定されているルートアカウントは存在するか
                    if (row['access_key_1_active'] == 'true'
                            or row['access_key_2_active'] == 'true'):
                        result = {
                            'Region': 'Global',
                            'Level': CommonConst.LEVEL_CODE_21,
                            'DetectionItem': {
                                'RootAccountAccessKeyAbnormity': True
                            }
                        }
                        check_results.append(result)
                    break
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_12.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_credential = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_s3(trace_id, check_credential, result_json_path,
                                True)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)

        # チェック結果
        if len(check_results) == 0:
            return CheckResult.Normal
        return CheckResult.CriticalDefect
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_12',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)


def get_account_summary(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "IAM_AccountSummary.json")

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            account_summary = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                                  s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            account_summary = IAMUtils.get_account_summary(
                trace_id, session, awsaccount)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

        if (len(account_summary) == 0):
            pm_logger.warning("[%s] アカウントサマリーの取得件数が０でした。", awsaccount)
            raise PmError()

        # アカウントサマリー情報をS3に保存します。
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", account_summary,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] アカウントサマリーのS3保存に失敗しました。", awsaccount)
    return account_summary


def check_cis_item_1_13(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        members):
    if members == Members.Enable:
        return CheckResult.MembersManagement
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        try:
            account_summary = get_account_summary(trace_id, check_history_id,
                                                  organization_id, project_id,
                                                  aws_account, session)
        except PmError as e:
            raise common_utils.write_log_exception(e, pm_logger)
        # チェック結果
        check_results = []
        try:
            if account_summary['AccountMFAEnabled'] != 1:
                check_result = {
                    'Region': 'Global',
                    'Level': CommonConst.LEVEL_CODE_21,
                    'DetectionItem': {
                        'RootAccountMfaAbnormity': True
                    }
                }
                check_results.append(check_result)
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_13.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_policy = {
                'AWSAccount': aws_account,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", check_policy,
                                  result_json_path)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_13',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_14(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        members):
    # メンバーズ加入アカウントなら、
    if members == Members.Enable:
        return CheckResult.MembersManagement

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    check1 = False
    check2 = False

    try:
        try:
            account_summary = get_account_summary(trace_id, check_history_id,
                                                  organization_id, project_id,
                                                  aws_account, session)
        except PmError as e:
            raise common_utils.write_log_exception(e, pm_logger)

        # 情報取得
        try:
            # IAMユーザの仮想MFAデバイスリストを取得する。
            list_virtual_mfa_devices = IAMUtils.list_virtual_mfa_devices(
                trace_id, session, aws_account)
        except PmError as e:
            raise common_utils.write_log_exception(e, pm_logger)

        # 取得した仮想MFAデバイスリストをS3に保存する（リソース情報ファイル）。
        try:
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, aws_account,
                "IAM_ListVirtualMfaDevices.json")
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  list_virtual_mfa_devices, s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] 仮想MFAデバイスリストのS3保存に失敗しました。", aws_account)
            raise common_utils.write_log_pm_error(e, pm_logger)

        # チェックルール
        try:
            # Check-1. MFA設定されていることを検出する。
            if account_summary['AccountMFAEnabled'] != 1:
                check1 = True

            # Check-2. ハードウェアMFAにより保護されていないルートアカウントを検出する。
            if check1 is False:
                mfa_abnormity = "arn:aws:iam::{}:mfa/root-account-mfa-device".format(
                    aws_account)
                for mfa_device in list_virtual_mfa_devices:
                    if (mfa_device['SerialNumber'] == mfa_abnormity
                            and common_utils.check_key("User", mfa_device)):
                        check2 = True
                        break
        except PmError as e:
            pm_logger.error("[%s]チェック処理中にエラーが発生しました。", aws_account)
            raise common_utils.write_log_pm_error(e, pm_logger)

        if check1 is True or check2 is True:
            check_results.append(get_check_cis_item_1_14_result(check1, check2))

        # Export File CHECK_CIS12_ITEM_1_14.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_cis_item_1_14 = {
                'AWSAccount': aws_account,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  check_cis_item_1_14, result_json_path)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_14',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.MinorInadequacies


def get_check_cis_item_1_14_result(check1, check2):
    detection_item = {}
    if check1 is True:
        detection_item['RootAccountMfaAbnormity'] = True
    if check2 is True:
        detection_item['RootAccountHardwareMfaAbnormity'] = True
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def check_cis_item_1_15(trace_id, check_item_code, check_history_id,
                        organization_id, project_id, aws_account,
                        result_json_path, members):
    if members == Members.Enable:
        return CheckResult.MembersManagement
    return cis_item_common_logic.execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, CommonConst.LEVEL_CODE_1)


def check_cis_item_1_16(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []

    try:
        # IAMユーザの一覧を取得する。
        try:
            list_users = IAMUtils.get_list_users(trace_id, session,
                                                 aws_account)
        except PmError as e:
            raise common_utils.write_log_exception(e, pm_logger)
        try:
            # 取得したユーザ一覧をS3に保存する（リソース情報ファイル）。
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, aws_account,
                "IAM_List_Users.json")
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", list_users,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] IAMユーザー一覧情報のS3保存に失敗しました。", aws_account)
            raise common_utils.write_log_pm_error(e, pm_logger)

        iam_client = IAMUtils.get_iam_client(trace_id, session, aws_account)
        for user in list_users:
            try:
                iam_user_name = user['UserName']
            except Exception as e:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
                raise common_utils.write_log_pm_error(e, pm_logger)

            # check excluded resources
            if common_utils.check_excluded_resources(
                    check_item_code, RegionName.Global,
                    ResourceType.User, iam_user_name,
                    excluded_resources):
                continue

            # 取得したユーザ一覧をもとに、各ユーザに直接アタッチされているポリシー情報（管理ポリシー）を取得する。
            try:
                attached_policies = IAMUtils.get_list_attached_user_policies(
                    trace_id, iam_client, aws_account, iam_user_name)
            except PmError as e:
                raise common_utils.write_log_exception(e, pm_logger)

            # 取得したポリシー情報（管理ポリシー）をS3に保存する（リソース情報ファイル）。
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, aws_account,
                    "IAM_List_Attached_User_Policies_" + iam_user_name + ".json")
                FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                      attached_policies, s3_file_name)
            except PmError as e:
                pm_logger.error("[%s] IAMユーザー（%s）にアタッチされた管理ポリシー一覧情報のS3保存に失敗しました。 ",
                                aws_account, iam_user_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            # 取得したユーザ一覧をもとに、各ユーザに直接付与されているポリシー情報（インラインポリシー）を取得する。
            try:
                list_user_policies = IAMUtils.get_list_user_policies(
                    trace_id, session, aws_account, iam_user_name)
            except PmError as e:
                raise common_utils.write_log_exception(e, pm_logger)

            # 取得したポリシー情報（インラインポリシー）をS3に保存する（リソース情報ファイル）。
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, aws_account,
                    "IAM_List_User_Policies_" + iam_user_name + ".json")
                FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                      list_user_policies, s3_file_name)
            except PmError as e:
                pm_logger.error(
                    "[%s] IAMユーザー（%s）に付与されたインラインポリシー一覧情報のS3保存に失敗しました。 ",
                    aws_account, iam_user_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            # チェック処理
            try:
                # Check-1. 管理ポリシーが直接アタッチされているIAMユーザが存在するか
                check1 = len(attached_policies) > 0

                # Check-2. インラインポリシーが直接付与されているIAMユーザが存在するか
                check2 = len(list_user_policies) > 0

                # チェックルールに該当するリソース（IAMユーザー）が一つでもあれば「重大な不備（2）」
                if check1 is True or check2 is True:
                    check_results.append(
                        get_check_cis_item_1_16_result(check1, check2,
                                                       iam_user_name))
            except PmError as e:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
                raise common_utils.write_log_pm_error(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_16.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_cis_item_1_16 = {
                'AWSAccount': aws_account,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  check_cis_item_1_16, result_json_path)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def get_check_cis_item_1_16_result(check1, check2, user_name):
    detection_item = {'UserName': user_name}
    if check1 is True:
        detection_item['ManagedPoliciesAttachedAbnormity'] = True
    if check2 is True:
        detection_item['InlinePoliciesAttachedAbnormity'] = True
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def check_cis_item_1_17(trace_id, check_item_code, check_history_id,
                        organization_id, project_id, aws_account,
                        result_json_path, members):
    if members == Members.Enable:
        return CheckResult.MembersManagement
    return cis_item_common_logic.execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, CommonConst.LEVEL_CODE_1)


def check_cis_item_1_18(trace_id, check_item_code, check_history_id,
                        organization_id, project_id, aws_account,
                        result_json_path, members):
    if members == Members.Enable:
        return CheckResult.MembersManagement
    return cis_item_common_logic.execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, CommonConst.LEVEL_CODE_1)


def check_cis_item_1_19(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        region_name = region["RegionName"]
        try:
            if region_name in CommonConst.REGION_IGNORE:
                continue

            ec2_client = Ec2Utils.get_ec2_client(trace_id, session,
                                                 region_name, awsaccount)
            try:
                reservation_instances = Ec2Utils.describe_instances(
                    trace_id, awsaccount, ec2_client, region_name)
            except PmError as e:
                data_body = {'RegionName': region_name}
                e.pm_notification_error = PmNotificationError(
                    check_item_code=check_item_code,
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DESCRIBE_INSTANCES,
                    data_body=data_body)
                raise common_utils.write_log_pm_error(e, pm_logger)
            if (len(reservation_instances) == 0):
                pm_logger.info("[%s/%s] EC2インスタンス情報の取得件数が0でした。", awsaccount,
                               region_name)
                continue
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, awsaccount,
                    "IAM_Instances_" + region_name + ".json")
                FileUtils.upload_s3(trace_id, reservation_instances,
                                    s3_file_name, True)
            except PmError as e:
                pm_logger.error("[%s/%s] EC2インスタンス情報のS3保存に失敗しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            # 取得したEC2インスタンス情報をもとにチェック処理を実行します。
            try:
                for reservation_instance in reservation_instances:
                    for instance in reservation_instance['Instances']:
                        # check excluded resources
                        if common_utils.check_excluded_resources(
                                check_item_code, region_name,
                                ResourceType.InstanceId,
                                instance['InstanceId'], excluded_resources):
                            continue

                        if common_utils.check_key("IamInstanceProfile",
                                                  instance) is False:
                            name = None
                            if common_utils.check_key("Tags", instance) is True:
                                name_tag = next(
                                    filter(lambda tag: tag['Key'] == 'Name',
                                           instance['Tags']), None)
                                name = None if name_tag is None else name_tag[
                                    'Value']
                            check_results.append(
                                get_check_cis_item_1_19_result(
                                    region_name, instance['InstanceId'], name))
            except Exception as e:
                pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_exception(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code=check_item_code,
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_1_19.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_1_19 = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_1_19, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.MinorInadequacies
    return CheckResult.Normal


def get_check_cis_item_1_19_result(region_name, instance_id, name):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_11,
        'DetectionItem': {
            'InstanceId': instance_id
        }
    }
    if (name is not None):
        result['DetectionItem']['Name'] = name
    return result


def get_list_policies(trace_id, check_history_id, organization_id, project_id,
                      awsaccount, session):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "IAM_List_Policies.json")

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            list_policies = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                                s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            list_policies = IAMUtils.get_list_policies(trace_id, session,
                                                       awsaccount)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

        if (len(list_policies) == 0):
            pm_logger.warning("[%s] ポリシー一覧情報の取得件数が０でした。", awsaccount)
            raise PmError()

        # アカウントパスワードポリシー情報をS3に保存します。
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", list_policies,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] ポリシー一覧情報のS3保存に失敗しました。", awsaccount)
    return list_policies


def check_cis_item_1_20(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        members):
    # メンバーズ加入アカウントなら、
    if members == Members.Enable:
        return CheckResult.MembersManagement

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        try:
            list_policies = get_list_policies(trace_id, check_history_id,
                                              organization_id, project_id,
                                              awsaccount, session)
        except Exception as e:
            raise common_utils.write_log_exception(e, pm_logger)

        # チェック結果
        check_results = []
        try:
            for policy in list_policies:
                if (policy['PolicyName'] == 'AWSSupportAccess'):
                    if policy['AttachmentCount'] == 0:
                        result = {
                            'Region': 'Global',
                            'Level': CommonConst.LEVEL_CODE_21,
                            'DetectionItem': {
                                'AWSSupportAccessPolicyAttachAbnormity': True
                            }
                        }
                        check_results.append(result)
                    break
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_20.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_policy = {
                'AWSAccount': awsaccount,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", check_policy,
                                  result_json_path)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code='CHECK_CIS12_ITEM_1_20',
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_21(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        credential_report = get_credential_report(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path)

        # チェック結果
        abnormality_users = []
        try:
            reader = csv.DictReader(credential_report.splitlines())
            for row in reader:
                resource_name = row['user']
                if (common_utils.check_excluded_resources(
                        check_item_code, RegionName.Global,
                        ResourceType.User, resource_name,
                        excluded_resources)):
                    continue

                check_1 = (row['access_key_1_last_used_date'] == CommonConst.NA
                           and row['access_key_1_active'] == 'true')
                check_2 = (row['access_key_2_last_used_date'] == CommonConst.NA
                           and row['access_key_2_active'] == 'true')
                if (check_1 is True or check_2 is True):
                    abnormality_users.append(resource_name)
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_21.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_cis_item_1_21 = {
                'AWSAccount':
                aws_account,
                'CheckResults': [{
                    'Region': 'Global',
                    'Level': CommonConst.LEVEL_CODE_21,
                    'DetectionItem': {
                        'AbnormalityUsers': abnormality_users
                    }
                }],
                'DateTime':
                current_date
            }
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  check_cis_item_1_21, result_json_path)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(abnormality_users) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def check_cis_item_1_22(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    try:
        try:
            list_policies = get_list_policies(trace_id, check_history_id,
                                              organization_id, project_id,
                                              aws_account, session)
        except PmError as e:
            raise common_utils.write_log_exception(e, pm_logger)

        # 対象AWSアカウントに対する接続を作成します。
        iam_client = IAMUtils.get_iam_client(trace_id, session, aws_account)

        for policy in list_policies:
            try:
                policy_name = policy['PolicyName']
            except Exception as e:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
                raise common_utils.write_log_exception(e, pm_logger)

            try:
                policy_version = IAMUtils.get_policy_version(
                    trace_id, iam_client, aws_account, policy['Arn'],
                    policy['DefaultVersionId'])
            except PmError as e:
                raise common_utils.write_log_exception(e, pm_logger)
            policy_enable = False
            statements = policy_version['Document']['Statement']
            if type(statements) is dict:
                statements = [statements]
            for statement in statements:
                if (common_utils.get_value("Effect", statement) == CommonConst.ALLOW
                        and common_utils.get_value(
                            "Resource", statement) == CommonConst.ALL
                        and common_utils.get_value(
                            "Action", statement) == CommonConst.ALL):
                    policy_enable = True
                    break
            if policy_enable is True:
                try:
                    entities_policy = IAMUtils.list_entities_for_policy(
                        trace_id, session, aws_account, policy['Arn'])
                except PmError as e:
                    raise common_utils.write_log_pm_error(e, pm_logger)

                try:
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        aws_account, "IAM_List_Entities_" + policy_name + ".json")
                    FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                          entities_policy, s3_file_name)
                except PmError as e:
                    pm_logger.error("[%s] ポリシー情報エンティティ情報のS3保存に失敗しました。",
                                    aws_account)
                    raise common_utils.write_log_pm_error(e, pm_logger)

                entities_policy['PolicyGroups'] = truncate_policy_resources(
                    check_item_code,
                    RegionName.Global,
                    ResourceType.Group,
                    "GroupName",
                    policy_name,
                    entities_policy['PolicyGroups'],
                    excluded_resources
                )

                entities_policy['PolicyUsers'] = truncate_policy_resources(
                    check_item_code,
                    RegionName.Global,
                    ResourceType.User,
                    "UserName",
                    policy_name,
                    entities_policy['PolicyUsers'],
                    excluded_resources
                )

                entities_policy['PolicyRoles'] = truncate_policy_resources(
                    check_item_code,
                    RegionName.Global,
                    ResourceType.Role,
                    "RoleName",
                    policy_name,
                    entities_policy['PolicyRoles'],
                    excluded_resources
                )

                try:
                    if (len(entities_policy['PolicyGroups']) > 0
                            or len(entities_policy['PolicyUsers']) > 0
                            or len(entities_policy['PolicyRoles']) > 0):
                        check_results.append(get_check_cis_item_1_22_result(
                            entities_policy,
                            policy_name
                        ))
                except PmError as e:
                    pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
                    raise common_utils.write_log_exception(e, pm_logger)

        # Export File CHECK_CIS12_ITEM_1_22.json
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_policy = {
                'AWSAccount': aws_account,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", check_policy,
                                  result_json_path)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def truncate_policy_resources(check_item_code, region_name, resource_type,
                              key_get_resource_name, policy_name, resources,
                              excluded_resources):
    pattern_get_excluded_resources = "[?CheckItemCode == '{0}' && RegionName == '{1}' && ResourceType == '{2}']".format(
        check_item_code,
        region_name,
        resource_type
    )

    excluded_resources_policy = jmespath.search(pattern_get_excluded_resources,
                                                excluded_resources)
    if (common_utils.is_null(resources)
            or len(excluded_resources_policy) <= 0):
        return resources

    for index, policy_group in enumerate(resources):
        resource_name = "{0},{1}".format(policy_name,
                                         policy_group[key_get_resource_name])

        if (common_utils.check_excluded_resources(check_item_code, region_name,
                                                  resource_type, resource_name,
                                                  excluded_resources_policy)):
            del resources[index]

    return resources


def get_check_cis_item_1_22_result(entities_policy, policy_name):
    detection_item = {'PolicyName': policy_name}
    abnormality_groups = []
    abnormality_users = []
    abnormality_roles = []
    for policy_group in entities_policy['PolicyGroups']:
        abnormality_groups.append(policy_group['GroupName'])
    for policy_users in entities_policy['PolicyUsers']:
        abnormality_users.append(policy_users['UserName'])
    for policy_roles in entities_policy['PolicyRoles']:
        abnormality_roles.append(policy_roles['RoleName'])

    detection_item['AbnormalityGroups'] = abnormality_groups
    detection_item['AbnormalityUsers'] = abnormality_users
    detection_item['AbnormalityRoles'] = abnormality_roles
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def convertDateToDays(date_str, current_date):
    days = 999
    if (len(date_str) > 20):
        date_convert = date_utils.toDate(date_str)
        days = date_utils.difference_days(date_convert, current_date)
    return days


def formatDate(date_str):
    if (len(date_str) > 20):
        date_convert = date_utils.toDate(date_str)
        return date_utils.toString(date_convert,
                                   date_utils.PATTERN_YYYYMMDDHHMMSS)
    return date_str


def get_credential_report(trace_id, check_history_id, organization_id,
                          project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "IAM_CredentialReport.csv")

    # 作成したCredentialReportを取得する。
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            credential_report = FileUtils.read_csv(trace_id, "S3_CHECK_BUCKET",
                                                   s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            credential_report = IAMUtils.get_credential_report(
                trace_id, session, awsaccount)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

        if (len(credential_report) == 0):
            pm_logger.warning("[%s] CredentialReport情報の取得件数が０でした。", awsaccount)
            raise PmError()

        # 取得したCredentialReportをS3に保存する（リソース情報ファイル）。
        try:
            FileUtils.upload_csv(trace_id, "S3_CHECK_BUCKET",
                                 credential_report, s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] CredentialReportのS3保存に失敗しました。", awsaccount)
    return credential_report


def get_account_password_policy(trace_id, check_history_id, organization_id,
                                project_id, awsaccount, session,
                                result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "IAM_AccountPasswordPolicy.json")

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            account_password_policy = FileUtils.read_json(
                trace_id, "S3_CHECK_BUCKET", s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            account_password_policy = IAMUtils.get_account_password_policy(
                trace_id, session, awsaccount)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

        # アカウントパスワードポリシー情報をS3に保存します。
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  account_password_policy, s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] アカウントパスワードポリシー情報のS3保存に失敗しました。", awsaccount)
    return account_password_policy
