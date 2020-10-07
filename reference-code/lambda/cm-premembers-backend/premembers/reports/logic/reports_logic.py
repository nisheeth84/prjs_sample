import os
import json
import inspect

from http import HTTPStatus
from premembers.common import common_utils, aws_common, FileUtils
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.const.const import CommonConst
from premembers.repository.const import Status, ReportStatus, ExcelStatus
from premembers.repository import pm_reports, pm_organizationTasks, pm_projects
from premembers.repository import pm_batchJobDefs

task_code = "DELETE_REPORT"
LIST_TYPE = ["EXCEL"]


def get_list_reports(trace_id, organization_id, project_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        reports = pm_reports.query_reports_filter_organization(
            trace_id, project_id, organization_id,
            convert_response=True)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # response when do success
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, reports)
    return common_utils.response(response, pm_logger)


def get_report(trace_id, report_id, organization_id, project_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    try:
        report = pm_reports.query_report_filter_organization_project(
            trace_id, report_id, project_id, organization_id,
            convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if (not report):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # response when do success
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, report[0])
    return common_utils.response(response, pm_logger)


def delete_report(trace_id, email, report_id, organization_id, project_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        # get report
        report_item = pm_reports.query_report_filter_organization_project(
            trace_id, report_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if (not report_item):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    try:
        # delete report
        pm_reports.delete_reports(trace_id, report_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_405,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    task_id = common_utils.get_uuid4()
    try:
        # create task informaiton request delete in Organization Tasks
        pm_organizationTasks.create_organizationTask(
            trace_id, task_id, task_code, report_id, trace_id, email, 0, 0, 3)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # Send message to organization topic task
    aws_common.sns_organization_topic(trace_id, task_id, task_code)

    # response if delete success
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def create_report(trace_id, email, organization_id, project_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if (not project):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # Parse JSON
    try:
        body_object = json.loads(data_body)
        report_name = body_object["name"]
        aws_accounts = body_object["awsAccounts"]
        output_file_type = body_object["outputFileType"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # Validate
    list_error = validate_report(trace_id, report_name, aws_accounts,
                                 output_file_type)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # Create report
    report_id = common_utils.get_uuid4()
    status = Status.Waiting.value
    html_output_status = Status.Waiting.value
    excel_output_status = Status.Waiting.value
    schema_version = CommonConst.SCHEMA_VERSION
    try:
        pm_reports.create_report(trace_id, report_id, report_name, email,
                                 aws_accounts, status, None, None, None,
                                 html_output_status, None, None,
                                 excel_output_status, None, None,
                                 schema_version, organization_id, project_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # AWS利用状況情報収集ジョブの設定
    # レポート中間ファイル作成ジョブの設定
    # レポート出力ジョブの設定
    codes = [
        'COLLECT_AWS_RESOURCE_INFO', 'OUTPUT_REPORT_JSON',
        'OUTPUT_REPORT_EXCEL'
    ]
    job_id = []
    for code in codes:
        response, job_id = job_report(trace_id, email, report_id, code, job_id)
        if response:
            # Delete report
            pm_reports.delete_reports(trace_id, report_id)
            return response

    try:
        report = pm_reports.query_report(trace_id, report_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    # return data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, report)
    return common_utils.response(response, pm_logger)


def get_report_url(trace_id, report_id, organization_id,
                   project_id, file_type):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # Validate
    list_error = validate_output_report(trace_id, file_type)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    try:
        report = pm_reports.query_report_filter_organization_project(
            trace_id, report_id, project_id, organization_id,
            ReportStatus.ConvertFinish)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not report:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    if report[0]["ExcelOutputStatus"] != ExcelStatus.Finish:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    try:
        excel_path = report[0]["ExcelPath"]
        bucket = os.environ.get("S3_REPORT_BUCKET")
        url = aws_common.generate_presigned_url(trace_id, bucket, excel_path)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_999,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response_body = {
        "URL": url
    }
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, response_body)
    return common_utils.response(response, pm_logger)


def request_output_report(trace_id, email, organization_id, project_id,
                          report_id, file_type):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # Validate
    list_error = validate_output_report(trace_id, file_type)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # レポートテーブルから、レポート情報を取得します。
    try:
        # get report
        report = pm_reports.query_report_filter_organization_project(
            trace_id, report_id, project_id, organization_id,
            ReportStatus.ConvertFinish.value)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if (not report):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # 指定のファイル形式のレポートがすでに作成済みか確認します。
    if (report[0]['ExcelOutputStatus'] != ExcelStatus.Waiting.value):
        return common_utils.error_common(MsgConst.ERR_302, HTTPStatus.CONFLICT,
                                         pm_logger)

    # レポート出力ジョブの設定
    job_id = []
    code = 'OUTPUT_REPORT_EXCEL'
    response, job_id = job_report(trace_id, email, report_id, code, job_id)
    if response:
        return common_utils.response(response, pm_logger)

    # 取得したジョブIDをレスポンス（ステータスコード:201）として返します。
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, job_id[0])
    return common_utils.response(response, pm_logger)


# Begin private function
def validate_output_report(trace_id, file_type):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    list_error = []
    # レポート出力するファイル形式
    if common_utils.is_null(file_type):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "fileType", file_type))
    elif file_type not in LIST_TYPE:
        params = []
        params.append(', '.join(LIST_TYPE))
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_302, "fileType", file_type, params))
    return common_utils.response(list_error, pm_logger)


def validate_report(trace_id, report_name, aws_accounts, output_file_type):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    list_error = []
    # レポート名
    if common_utils.is_null(report_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "name", report_name))
    elif not common_utils.is_str(report_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_202, "name", report_name))

    # AWSアカウントID
    if not common_utils.is_list(aws_accounts):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_204, "awsAccounts", aws_accounts))
    elif len(aws_accounts) == 0:
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "awsAccounts", aws_accounts))

    # レポート出力するファイル形式
    if common_utils.is_null(output_file_type):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "outputFileType", output_file_type))
    elif output_file_type not in LIST_TYPE:
        params = []
        params.append(', '.join(LIST_TYPE))
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_302, "outputFileType", output_file_type, params))
    return common_utils.response(list_error, pm_logger)


def job_report(trace_id, email, report_id, code, job_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        report_job_def = pm_batchJobDefs.query_report_job_def_key(
            trace_id, code)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True), None

    if not report_job_def:
        pm_logger.error("ジョブ定義情報が取得できませんでした。:" + code)
        return common_utils.error_common(MsgConst.ERR_402,
                                         HTTPStatus.INTERNAL_SERVER_ERROR,
                                         pm_logger), None

    # ログID（UUID（v４））
    log_id = common_utils.get_uuid4()

    # AWS Batch
    job_name = code + "-" + log_id
    job_queue = report_job_def['JobQueue']
    job_definition = report_job_def['JobDefinition']
    parameters = {
        "ReportID": "--reportId=" + report_id,
        "LogID": "--logId=" + log_id
    }
    container_overrides = {}
    if (common_utils.check_key('Environment', report_job_def) and len(
            report_job_def['Environment']) > 0):
        container_overrides = report_job_def['Environment']
    max_retry = report_job_def['MaxRetry']

    try:
        # submid job
        job_id, parameter = aws_common.submit_job(
            trace_id, job_name, job_queue, job_id, job_definition, parameters,
            container_overrides, max_retry)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_AWS_601,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True), None
    # Create ReportJobLogs
    user_id = trace_id
    # 配列内のオブジェクトとして格納されていたので、job_idのみを抽出する(暫定対応)
    job_id_key = job_id[0]['jobId']

    date_now = common_utils.get_current_date()
    try:
        report_log = {
            'ReportID': report_id,
            'LogID': log_id,
            'Code': code,
            'UserID': user_id,
            'MailAddress': email,
            'JobID': job_id_key,
            'Parameter': parameter,
            'CreatedAt': date_now,
            'UpdatedAt': date_now
        }
        s3_file_name = CommonConst.PATH_REPORT_BATCH.format(
            report_id, log_id + ".json")
        FileUtils.upload_json(trace_id, "S3_BATCH_LOG_BUCKET", report_log,
                              s3_file_name)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_S3_701,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True), None
    return common_utils.response(None, pm_logger), job_id
# End private function
