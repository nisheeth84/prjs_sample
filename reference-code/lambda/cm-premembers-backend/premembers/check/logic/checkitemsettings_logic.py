import inspect
import json
import jmespath

from decimal import Decimal
from datetime import timedelta
from http import HTTPStatus
from premembers.common import common_utils, date_utils, checkauthority
from premembers.repository.const import Authority
from premembers.const.msg_const import MsgConst
from premembers.repository import pm_awsAccountCoops, pm_assessmentItems
from premembers.repository import pm_exclusionResources
from premembers.repository import pm_exclusionitems, pm_projects
from premembers.const.const import CommonConst
from premembers.repository.const import Members, ExclusionFlag, AssessmentFlag
from premembers.repository.const import ExcludedResourceFlag
from premembers.repository.const import ManagedFlag


LIST_CHECK_ITEM_CODE = [
    "CHECK_CIS12_ITEM_1_01", "CHECK_CIS12_ITEM_1_02", "CHECK_CIS12_ITEM_1_03",
    "CHECK_CIS12_ITEM_1_04", "CHECK_CIS12_ITEM_1_05", "CHECK_CIS12_ITEM_1_06",
    "CHECK_CIS12_ITEM_1_07", "CHECK_CIS12_ITEM_1_08", "CHECK_CIS12_ITEM_1_09",
    "CHECK_CIS12_ITEM_1_10", "CHECK_CIS12_ITEM_1_11", "CHECK_CIS12_ITEM_1_12",
    "CHECK_CIS12_ITEM_1_13", "CHECK_CIS12_ITEM_1_14", "CHECK_CIS12_ITEM_1_15",
    "CHECK_CIS12_ITEM_1_16", "CHECK_CIS12_ITEM_1_17", "CHECK_CIS12_ITEM_1_18",
    "CHECK_CIS12_ITEM_1_19", "CHECK_CIS12_ITEM_1_20", "CHECK_CIS12_ITEM_1_21",
    "CHECK_CIS12_ITEM_1_22", "CHECK_CIS12_ITEM_2_01", "CHECK_CIS12_ITEM_2_02",
    "CHECK_CIS12_ITEM_2_03", "CHECK_CIS12_ITEM_2_04", "CHECK_CIS12_ITEM_2_05",
    "CHECK_CIS12_ITEM_2_06", "CHECK_CIS12_ITEM_2_07", "CHECK_CIS12_ITEM_2_08",
    "CHECK_CIS12_ITEM_2_09", "CHECK_CIS12_ITEM_3_01", "CHECK_CIS12_ITEM_3_02",
    "CHECK_CIS12_ITEM_3_03", "CHECK_CIS12_ITEM_3_04", "CHECK_CIS12_ITEM_3_05",
    "CHECK_CIS12_ITEM_3_06", "CHECK_CIS12_ITEM_3_07", "CHECK_CIS12_ITEM_3_08",
    "CHECK_CIS12_ITEM_3_09", "CHECK_CIS12_ITEM_3_10", "CHECK_CIS12_ITEM_3_11",
    "CHECK_CIS12_ITEM_3_12", "CHECK_CIS12_ITEM_3_13", "CHECK_CIS12_ITEM_3_14",
    "CHECK_CIS12_ITEM_4_01", "CHECK_CIS12_ITEM_4_02", "CHECK_CIS12_ITEM_4_03",
    "CHECK_CIS12_ITEM_4_04", "CHECK_ASC_ITEM_01_01", "CHECK_ASC_ITEM_02_01",
    "CHECK_ASC_ITEM_02_02", "CHECK_ASC_ITEM_03_01", "CHECK_ASC_ITEM_04_01",
    "CHECK_ASC_ITEM_05_01", "CHECK_ASC_ITEM_06_01", "CHECK_ASC_ITEM_07_01",
    "CHECK_ASC_ITEM_08_01", "CHECK_ASC_ITEM_09_01", "CHECK_ASC_ITEM_10_01",
    "CHECK_ASC_ITEM_11_01", "CHECK_ASC_ITEM_12_01", "CHECK_ASC_ITEM_13_01",
    "CHECK_ASC_ITEM_14_01", "CHECK_ASC_ITEM_15_01", "CHECK_ASC_ITEM_16_01",
    "CHECK_IBP_ITEM_01_01", "CHECK_IBP_ITEM_02_01", "CHECK_IBP_ITEM_03_01",
    "CHECK_IBP_ITEM_04_01", "CHECK_IBP_ITEM_05_01", "CHECK_IBP_ITEM_06_01",
    "CHECK_IBP_ITEM_07_01", "CHECK_IBP_ITEM_07_02", "CHECK_IBP_ITEM_07_03",
    "CHECK_IBP_ITEM_07_04", "CHECK_IBP_ITEM_07_05", "CHECK_IBP_ITEM_07_06",
    "CHECK_IBP_ITEM_07_07", "CHECK_IBP_ITEM_07_08", "CHECK_IBP_ITEM_08_01",
    "CHECK_IBP_ITEM_09_01", "CHECK_IBP_ITEM_10_01", "CHECK_IBP_ITEM_11_01",
    "CHECK_IBP_ITEM_12_01", "CHECK_IBP_ITEM_13_01", "CHECK_IBP_ITEM_14_01",
    "CHECK_IBP_ITEM_14_02", "CHECK_IBP_ITEM_14_03", "CHECK_IBP_ITEM_14_04",
    "CHECK_IBP_ITEM_14_05"
]


LIST_CHECK_ITEM_CODE_ASSESSMENT = [
    "CHECK_CIS12_ITEM_1_15", "CHECK_CIS12_ITEM_1_17", "CHECK_CIS12_ITEM_1_18",
    "CHECK_CIS12_ITEM_4_04", "CHECK_ASC_ITEM_02_02", "CHECK_ASC_ITEM_05_01",
    "CHECK_ASC_ITEM_06_01", "CHECK_ASC_ITEM_09_01", "CHECK_ASC_ITEM_11_01",
    "CHECK_ASC_ITEM_14_01", "CHECK_ASC_ITEM_15_01", "CHECK_IBP_ITEM_04_01",
    "CHECK_IBP_ITEM_06_01", "CHECK_IBP_ITEM_10_01", "CHECK_IBP_ITEM_13_01",
    "CHECK_IBP_ITEM_14_03"
]


LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE = [
    "CHECK_CIS12_ITEM_1_02", "CHECK_CIS12_ITEM_1_03", "CHECK_CIS12_ITEM_1_04",
    "CHECK_CIS12_ITEM_1_16", "CHECK_CIS12_ITEM_1_19", "CHECK_CIS12_ITEM_1_21",
    "CHECK_CIS12_ITEM_1_22", "CHECK_CIS12_ITEM_2_02", "CHECK_CIS12_ITEM_2_03",
    "CHECK_CIS12_ITEM_2_04", "CHECK_CIS12_ITEM_2_06", "CHECK_CIS12_ITEM_2_07",
    "CHECK_CIS12_ITEM_2_08", "CHECK_CIS12_ITEM_2_09", "CHECK_CIS12_ITEM_4_01",
    "CHECK_CIS12_ITEM_4_02", "CHECK_CIS12_ITEM_4_03"
]


LIST_CHECK_ITEM_CODE_MANAGED = [
    "CHECK_CIS12_ITEM_1_01", "CHECK_CIS12_ITEM_1_12", "CHECK_CIS12_ITEM_1_13",
    "CHECK_CIS12_ITEM_1_14", "CHECK_CIS12_ITEM_1_15", "CHECK_CIS12_ITEM_1_17",
    "CHECK_CIS12_ITEM_1_18", "CHECK_CIS12_ITEM_1_20", "CHECK_ASC_ITEM_01_01",
    "CHECK_IBP_ITEM_01_01"
]


def create_excluesion_item(trace_id, user_id, organization_id, project_id,
                           email, check_item_code, coop_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        awscoop_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)
    if not awscoop_item:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # リクエストボディのJSONでパースエラーが発生した場合は、エラーログを出力してエラーレスポンスを返します。
    try:
        body_object = json.loads(data_body)
        exclusion_comment = body_object["exclusionComment"].strip()
    except Exception as err:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, err,
                                            pm_logger, True)

    # 全てのチェックを行い、エラーがあった場合はエラーログを出力してエラーレスポンスを返します。
    list_error = validate_insert(exclusion_comment)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # チェック項目除外設定テーブルに除外設定レコードを作成します。
    aws_account = awscoop_item['AWSAccount']
    exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
        organization_id, project_id, aws_account, check_item_code)
    account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
        organization_id, project_id, aws_account)
    time_to_live_date = date_utils.get_current_date() + timedelta(days=180)
    time_to_live = Decimal(time_to_live_date.timestamp())

    try:
        pm_exclusionitems.create(trace_id, exclusion_item_id, organization_id,
                                 project_id, aws_account, check_item_code,
                                 time_to_live, exclusion_comment, user_id,
                                 email, account_refine_code)
    except Exception as e:
        return common_utils.error_common(
            MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR, pm_logger)

    try:
        exclusion_item = pm_exclusionitems.query_key(trace_id,
                                                     exclusion_item_id, True)
    except Exception as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, exclusion_item)
    return common_utils.response(response, pm_logger)


def delete_excluesion_item(trace_id, organization_id, project_id,
                           check_item_code, coop_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        awscoop_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if not awscoop_item:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # チェック項目除外設定テーブルに除外設定レコードを作成します。
    exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
        organization_id, project_id, awscoop_item['AWSAccount'],
        check_item_code)

    try:
        exclusion_item = pm_exclusionitems.query_key(trace_id,
                                                     exclusion_item_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not exclusion_item:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    try:
        pm_exclusionitems.delete(trace_id, exclusion_item_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_DB_405,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def validate_insert(exclusion_comment):
    list_error = []

    # チェック項目除外コメント
    if len(exclusion_comment) > CommonConst.EXCLUSION_COMMENT_MAX_LENGTH:
        list_error.append(
            common_utils.get_error_validate(
                MsgConst.ERR_VAL_303, "exclusionComment", exclusion_comment,
                [CommonConst.EXCLUSION_COMMENT_MAX_LENGTH]))

    return list_error


def get_excluesion_item(trace_id, organization_id, project_id, check_item_code,
                        coop_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        awscoop_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    if not awscoop_item:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # チェック項目除外情報を取得します。
    exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
        organization_id, project_id, awscoop_item['AWSAccount'],
        check_item_code)

    try:
        exclusion_item = pm_exclusionitems.query_key(trace_id,
                                                     exclusion_item_id, True)
    except Exception as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    if not exclusion_item:
        exclusion_item = []

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, exclusion_item)
    return common_utils.response(response, pm_logger)


def get_assessment_item(trace_id, organization_id, project_id, coop_id,
                        check_item_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # AWSアカウントAWSAccountは、AWSアカウント連携テーブルに、AWSアカウント連携ID{coop_id}をキーとしてクエリを実行します。
    try:
        awscoops_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 有効なAWSアカウントが存在しなかった場合（取得件数が0件）
    if (not awscoops_item):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # マニュアル評価情報を取得します。
    assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
        organization_id, project_id, awscoops_item['AWSAccount'],
        check_item_code)
    try:
        assessment_item = pm_assessmentItems.query_key(
            trace_id, assessment_item_id, True)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 該当レコードが存在しなかった場合（取得件数が0件）
    if (not assessment_item):
        assessment_item = []

    # 取得したチェック項目除外情報をレスポンス（ステータスコード:200）として返します。
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, assessment_item)
    return common_utils.response(response, pm_logger)


def create_assessment_item(trace_id, user_id, organization_id, project_id,
                           coop_id, check_item_code, email, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # AWSアカウントAWSAccountは、AWSアカウント連携テーブルに、AWSアカウント連携ID{coop_id}をキーとしてクエリを実行します。
    try:
        awscoops_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 有効なAWSアカウントが存在しなかった場合（取得件数が0件）
    if (not awscoops_item):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # リクエストボディのJSONでパースエラーが発生した場合は、エラーログを出力してエラーレスポンスを返します。
    try:
        body_object = json.loads(data_body)
        assessment_comment = body_object["assessmentComment"].strip()
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # 全てのチェックを行い、エラーがあった場合はエラーログを出力してエラーレスポンスを返します。
    list_error = validate_insert_assessment(check_item_code,
                                            assessment_comment)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # 評価結果テーブルに評価レコードを作成します。
    aws_account = awscoops_item['AWSAccount']
    assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
        organization_id, project_id, aws_account, check_item_code)
    account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
        organization_id, project_id, aws_account)
    time_to_live_date = date_utils.get_current_date() + timedelta(days=180)
    time_to_live = Decimal(time_to_live_date.timestamp())
    try:
        pm_assessmentItems.create(
            trace_id, assessment_item_id, organization_id, project_id,
            aws_account, check_item_code, time_to_live, assessment_comment,
            user_id, email, account_refine_code)
    except Exception:
        return common_utils.error_common(
            MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR, pm_logger)
    try:
        assessment_item = pm_assessmentItems.query_key(
            trace_id, assessment_item_id, True)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, assessment_item)
    return common_utils.response(response, pm_logger)


def validate_insert_assessment(check_item_code, assessment_comment):
    list_error = []

    # チェック項目コード
    if check_item_code not in LIST_CHECK_ITEM_CODE_ASSESSMENT:
        params = []
        params.append(', '.join(LIST_CHECK_ITEM_CODE_ASSESSMENT))
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_302, "checkItemCode", check_item_code, params))

    # 手動評価コメント
    if len(assessment_comment) > CommonConst.ASSESSMENT_COMMENT_MAX_LENGTH:
        list_error.append(
            common_utils.get_error_validate(
                MsgConst.ERR_VAL_303, "assessmentComment", assessment_comment,
                [CommonConst.ASSESSMENT_COMMENT_MAX_LENGTH]))

    return list_error


def delete_assessment_item(trace_id, organization_id, project_id,
                           check_item_code, coop_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        awscoop_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if not awscoop_item:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # マニュアル評価情報を取得します。
    assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
        organization_id, project_id, awscoop_item['AWSAccount'],
        check_item_code)
    try:
        assessment_item = pm_assessmentItems.query_key(
            trace_id, assessment_item_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not assessment_item:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # マニュアル評価情報を削除します。
    try:
        pm_assessmentItems.delete(trace_id, assessment_item_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_DB_405,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def list_item_settings(trace_id, organization_id, project_id, coop_id,
                       group_filter):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    # プロジェクトテーブルに、プロジェクトID{project_id}をキーとしてクエリを実行します。
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # プロジェクトに該当レコードが存在しなかった場合（取得件数が0件）
    if (not project):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # AWSアカウントAWSAccountは、AWSアカウント連携テーブルに、AWSアカウント連携ID{coop_id}をキーとしてクエリを実行します。
    try:
        awscoops_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 有効なAWSアカウントが存在しなかった場合（取得件数が0件）
    if (not awscoops_item):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # チェック項目除外情報を取得します。
    account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
        organization_id, project_id, awscoops_item['AWSAccount'])
    try:
        exclusion_items = pm_exclusionitems.query_filter_account_refine_code(
            trace_id, account_refine_code, group_filter)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # マニュアル評価情報を取得します。
    try:
        assessment_items = pm_assessmentItems.query_filter_account_refine_code(
            trace_id, account_refine_code, group_filter)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # リソース除外情報を取得します。
    try:
        exclusion_resources = pm_exclusionResources.query_filter_account_refine_code(
            trace_id, account_refine_code, group_filter)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # メンバーズ加入アカウントの確認をします
    members = common_utils.get_value('Members', awscoops_item, Members.Disable)
    if (isinstance(members, Decimal)):
        members = int(members)

    # セキュリティチェック項目設定一覧の配列を作成します。
    security_item_settings = []
    list_check_item_code_exclusion = jmespath.search('[*].CheckItemCode',
                                                     exclusion_items)
    list_check_item_code_assessment = jmespath.search('[*].CheckItemCode',
                                                      assessment_items)
    list_check_item_code_exclusion_resource = jmespath.search(
        '[*].CheckItemCode', exclusion_resources)
    for check_item_code in LIST_CHECK_ITEM_CODE:
        # リクエストパラメータgroupFilterにてフィルタ文字列が指定されていた場合、その文字列に該当するチェック項目コードを持つチェックだけ配列へ含めます。
        if (common_utils.is_null(group_filter) is False
                and group_filter not in check_item_code):
            continue

        # マネージド項目有無managedFlag
        managed_flag = ManagedFlag.NotManaged
        if (check_item_code in LIST_CHECK_ITEM_CODE_MANAGED):
            if members == Members.Enable:
                managed_flag = ManagedFlag.Managed

        # チェック項目除外有無exclusionFlag
        exclusion_flag = ExclusionFlag.Disable
        if (check_item_code in list_check_item_code_exclusion):
            exclusion_flag = ExclusionFlag.Enable

        # マニュアル評価設定有無assessmentFlag
        assessment_flag = AssessmentFlag.NotManual
        if (check_item_code in LIST_CHECK_ITEM_CODE_ASSESSMENT):
            assessment_flag = AssessmentFlag.NotAssessment

            if (check_item_code in list_check_item_code_assessment):
                assessment_flag = AssessmentFlag.Assessment

        # リソース除外設定有無excludedResourceFlag
        excluded_resource_flag = ExcludedResourceFlag.Other
        if (check_item_code in LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE):
            excluded_resource_flag = ExcludedResourceFlag.Disable

            if (check_item_code in list_check_item_code_exclusion_resource):
                excluded_resource_flag = ExcludedResourceFlag.Enable

        security_item_setting = {
            "checkItemCode": check_item_code,
            "managedFlag": managed_flag,
            "exclusionFlag": exclusion_flag,
            "assessmentFlag": assessment_flag,
            "excludedResourceFlag": excluded_resource_flag
        }
        security_item_settings.append(security_item_setting)

    # 作成したSecurityItemSettingの配列をレスポンスとして作成します。
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, security_item_settings)
    return common_utils.response(response, pm_logger)


def execute_copy_item_setting(trace_id, organization_id_destination,
                              project_id_destination, coop_id_destination,
                              body_object, email, user_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # Parse JSON
    try:
        body_object_json = json.loads(body_object)
        organization_id_source = body_object_json['copy_source']['organization_id']
        project_id_source = body_object_json['copy_source']['project_id']
        coop_id_source = body_object_json['copy_source']['coop_id']
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # アクセス権限チェックを行います。コピー元の組織ID
    response_authority_source = checkauthority.authority(
        trace_id, user_id, organization_id_source, Authority.Editor)
    if response_authority_source:
        return common_utils.response(response_authority_source, pm_logger)

    # アクセス権限チェックを行います。コピー先の組織ID
    response_authority_destination = checkauthority.authority(
        trace_id, user_id, organization_id_destination, Authority.Editor)
    if response_authority_destination:
        return common_utils.response(response_authority_destination, pm_logger)

    # リソース関連性のバリデーションチェックを行います。
    # コピー元のAWSアカウント連携ID{coop_id}をキーとして、AWSアカウント連携テーブルへクエリを実行する。
    try:
        awscoops_item_source = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id_source)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 有効なAWSアカウントが存在しなかった場合（取得件数が0件）
    if not awscoops_item_source:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # コピー先のAWSアカウント連携ID{coopId}をキーとして、AWSアカウント連携テーブルへクエリを実行する。
    try:
        awscoops_item_destination = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id_destination)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 有効なAWSアカウントが存在しなかった場合（取得件数が0件）
    if not awscoops_item_destination:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # コピー元のチェック項目除外情報を取得します。
    account_refine_code_source = CommonConst.ACCOUNT_REFINE_CODE.format(
        organization_id_source, project_id_source,
        awscoops_item_source['AWSAccount'])
    try:
        exclusion_items_source = pm_exclusionitems.query_filter_account_refine_code(
            trace_id, account_refine_code_source)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # コピー元のマニュアル評価情報を取得します。
    try:
        assessment_items_source = pm_assessmentItems.query_filter_account_refine_code(
            trace_id, account_refine_code_source)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # PM_AssessmentItemsとPM_ExclusionItems両方のレコードが取得できなかった場合、エラーログを出力してエラーレスポンスを返します。
    if len(exclusion_items_source) == 0 and len(assessment_items_source) == 0:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    aws_account_destination = awscoops_item_destination['AWSAccount']
    account_refine_code_destination = CommonConst.ACCOUNT_REFINE_CODE.format(
        organization_id_destination, project_id_destination,
        aws_account_destination)
    time_to_live_exclusion_destination = common_utils.get_time_to_live(
        CommonConst.EXCLUSION_EXPIRATION_DATE)

    # 作成処理は、先に取得した「コピー元のチェック項目除外情報」のレコード数分、繰り返します。
    try:
        for exclusion_item in exclusion_items_source:
            exclusion_item_id_destination = CommonConst.EXCLUSIONITEM_ID.format(
                organization_id_destination, project_id_destination,
                aws_account_destination, exclusion_item['CheckItemCode'])
            pm_exclusionitems.create(
                trace_id, exclusion_item_id_destination,
                organization_id_destination, project_id_destination,
                aws_account_destination, exclusion_item['CheckItemCode'],
                time_to_live_exclusion_destination,
                common_utils.get_value("ExclusionComment", exclusion_item),
                user_id, email, account_refine_code_destination)
    except Exception:
        return common_utils.error_common(
            MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR, pm_logger)

    time_to_live_assessment_destination = common_utils.get_time_to_live(
        CommonConst.ASSESSMENT_EXPIRATION_DATE)

    # 作成処理は、先に取得した「コピー元のマニュアル評価情報」のレコード数分、繰り返します。
    try:
        for assessment_item in assessment_items_source:
            assessment_item_id_destination = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id_destination, project_id_destination,
                aws_account_destination, assessment_item['CheckItemCode'])
            pm_assessmentItems.create(
                trace_id, assessment_item_id_destination,
                organization_id_destination, project_id_destination,
                aws_account_destination, assessment_item['CheckItemCode'],
                time_to_live_assessment_destination,
                common_utils.get_value("AssessmentComment", assessment_item),
                user_id, email, account_refine_code_destination)
    except Exception:
        return common_utils.error_common(
            MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR, pm_logger)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def create_excluded_resources(trace_id, user_id, organization_id, project_id,
                              coop_id, check_item_code, email, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # AWSアカウントAWSAccountは、AWSアカウント連携テーブルに、AWSアカウント連携ID{coop_id}をキーとしてクエリを実行します。
    try:
        awscoops_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 有効なAWSアカウントが存在しなかった場合（取得件数が0件）
    if (not awscoops_item):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # チェック項目コード
    if check_item_code not in LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # リクエストボディのJSONでパースエラーが発生した場合は、エラーログを出力してエラーレスポンスを返します。
    try:
        body_object = json.loads(data_body)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    region_name = common_utils.get_value("regionName", body_object, None)
    resource_type = common_utils.get_value("resourceType", body_object, None)
    resource_name = common_utils.get_value("resourceName", body_object, None)
    exclusion_comment = common_utils.get_value("exclusionComment", body_object,
                                               None).strip()

    # 全てのチェックを行い、エラーがあった場合はエラーログを出力してエラーレスポンスを返します。
    list_error = validate_create_excluded_resources(
        region_name, resource_type, resource_name, exclusion_comment)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    aws_account = awscoops_item['AWSAccount']
    check_item_refine_code = CommonConst.CHECK_ITEM_REFINE_CODE.format(
        organization_id, project_id, aws_account, check_item_code)
    try:
        excluded_resource = pm_exclusionResources.query_filter_region_name_and_resource_name(
            trace_id, check_item_refine_code, region_name, resource_type, resource_name)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not excluded_resource:
        exclusion_resource_id = common_utils.get_uuid4()
        account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
            organization_id, project_id, aws_account)
        time_to_live_date = date_utils.get_current_date() + timedelta(days=180)
        time_to_live = Decimal(time_to_live_date.timestamp())
        # リソース除外設定テーブルに除外設定レコードを作成します。
        try:
            pm_exclusionResources.create(
                user_id, exclusion_resource_id, organization_id, project_id,
                aws_account, check_item_code, region_name, resource_type,
                resource_name, exclusion_comment, email, account_refine_code,
                check_item_refine_code, time_to_live)
        except Exception as e:
            return common_utils.error_exception(
                MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
    else:
        exclusion_resource_id = excluded_resource[0]["ExclusionResourceID"]
        attribute = {'ExclusionComment': {"Value": exclusion_comment}}
        try:
            pm_exclusionResources.update(trace_id, exclusion_resource_id,
                                         attribute)
        except Exception as e:
            return common_utils.error_exception(
                MsgConst.ERR_DB_404, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)

    try:
        excluded_resource_new = pm_exclusionResources.query_key(
            trace_id, exclusion_resource_id, True)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, excluded_resource_new)
    return common_utils.response(response, pm_logger)


def validate_create_excluded_resources(region_name, resource_type,
                                       resource_name, exclusion_comment):
    # リージョン名, リソース名
    list_error = validate_excluded_resources(region_name, resource_type,
                                             resource_name)

    # チェック項目除外コメント
    if len(exclusion_comment) > CommonConst.EXCLUSION_COMMENT_MAX_LENGTH:
        list_error.append(
            common_utils.get_error_validate(
                MsgConst.ERR_VAL_303, "exclusionComment", exclusion_comment,
                [CommonConst.EXCLUSION_COMMENT_MAX_LENGTH]))

    return list_error


def delete_excluded_resources(trace_id, organization_id, project_id,
                              check_item_code, coop_id, region_name,
                              resource_type, resource_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # validate param query string of delete exclusion resource
    list_error = validate_excluded_resources(region_name,
                                             resource_type,
                                             resource_name,
                                             is_query_string=True)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # リソース関連性のバリデーションチェックを行います。
    try:
        awscoop_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not awscoop_item:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    check_item_refine_code = CommonConst.CHECK_ITEM_REFINE_CODE.format(
        organization_id, project_id, awscoop_item['AWSAccount'],
        check_item_code)

    # リソース除外設定情報を取得します。
    try:
        exclusion_resources = pm_exclusionResources.query_check_item_refine_code(
            trace_id, check_item_refine_code)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not exclusion_resources:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    patern_filter_data = "[?RegionName == '{0}' && ResourceType == '{1}' && ResourceName == '{2}']".format(region_name, resource_type, resource_name)
    list_exclusion_resource_delete = jmespath.search(patern_filter_data,
                                                     exclusion_resources)

    if len(list_exclusion_resource_delete) == 0:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # リソース除外設定情報を削除します。
    for exclusion_resource_delete in list_exclusion_resource_delete:
        try:
            pm_exclusionResources.delete(
                trace_id, exclusion_resource_delete['ExclusionResourceID'])
        except Exception as e:
            return common_utils.error_exception(
                MsgConst.ERR_DB_405, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def validate_excluded_resources(region_name,
                                resource_type,
                                resource_name,
                                is_query_string=False):
    list_error = []
    region_name_key = 'regionName'
    resource_name_key = 'resourceName'
    resource_type_key = 'resourceType'
    if is_query_string is True:
        region_name_key = 'region_name'
        resource_name_key = 'resource_name'
        resource_type_key = 'resource_type'

    # validate region_name
    if common_utils.is_null(region_name):
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                            region_name_key, region_name))

    # validate resource_name
    if common_utils.is_null(resource_name):
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                            resource_name_key, resource_name))

    # validate resource_type
    if common_utils.is_null(resource_type):
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                            resource_type_key, resource_type))

    return list_error


def get_excluded_resources(trace_id, project_id, organization_id, coop_id,
                           check_item_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        awscoop_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not awscoop_item:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    check_item_refine_code = CommonConst.CHECK_ITEM_REFINE_CODE.format(
        organization_id, project_id, awscoop_item['AWSAccount'],
        check_item_code)

    # リソース除外設定情報を取得します。
    try:
        excluded_resources = pm_exclusionResources.query_check_item_refine_code(
            trace_id, check_item_refine_code, None, True)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, excluded_resources)
    return common_utils.response(response, pm_logger)
