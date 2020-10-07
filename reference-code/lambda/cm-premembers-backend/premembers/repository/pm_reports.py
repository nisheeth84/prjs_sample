import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr

PROJECT_INDEX = 'ProjectIndex'

RESPONSE_REPORT = {
    'ReportID': 'id',
    'ReportName': 'name',
    'GenerateUser': 'generateUser',
    'AWSAccounts': 'awsAccounts',
    'ReportStatus': 'status',
    'ErrorCode': 'errorCode',
    'ResourceInfoPath': 'resourceInfoPath',
    'JsonOutputPath': 'jsonOutputPath',
    'JsonOutputTime': 'jsonOutputTime',
    'HTMLOutputStatus': 'htmlOutputStatus',
    'HTMLPath': 'htmlPath',
    'HTMLOutputTime': 'htmlOutputTime',
    'ExcelOutputStatus': 'excelOutputStatus',
    'ExcelPath': 'excelPath',
    'ExcelOutputTime': 'excelOutputTime',
    'SchemaVersion': 'schemaVersion',
    'OrganizationID': 'organizationId',
    'ProjectID': 'projectId',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def query_report(trace_id, report_id, convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {"ReportID": report_id}
    result = DB_utils.query_key(trace_id, Tables.PM_REPORTS, key)
    if convert_response:
        result = common_utils.convert_response(
            trace_id, result, RESPONSE_REPORT)

    return common_utils.response(result, pm_logger)


def query_report_filter(trace_id, report_id, filter_expression=None,
                        convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'ReportID': {
            'AttributeValueList': [report_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query(trace_id, Tables.PM_REPORTS,
                            key_conditions, filter_expression)

    if convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_REPORT)
    return common_utils.response(result, pm_logger)


def create_report(trace_id, report_id, report_name, generate_user,
                  aws_accounts, status, resource_info_path, json_output_path,
                  json_output_time, html_output_status, html_path,
                  html_output_time, excel_output_status, excel_path,
                  excel_output_time, schema_version, organization_id,
                  project_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    create_report = {
        'ReportID': report_id,
        'ReportName': report_name,
        'GenerateUser': generate_user,
        'AWSAccounts': aws_accounts,
        'ReportStatus': status,
        'ResourceInfoPath': resource_info_path,
        'JsonOutputPath': json_output_path,
        'JsonOutputTime': json_output_time,
        'HTMLOutputStatus': html_output_status,
        'HTMLPath': html_path,
        'HTMLOutputTime': html_output_time,
        'ExcelOutputStatus': excel_output_status,
        'ExcelPath': excel_path,
        'ExcelOutputTime': excel_output_time,
        'SchemaVersion': schema_version,
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("ReportID").not_exists()
    DB_utils.create(trace_id, Tables.PM_REPORTS, create_report,
                    condition_expression)


def delete_reports(trace_id, report_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"ReportID": report_id}
    DB_utils.delete(trace_id, Tables.PM_REPORTS, key)


def query_list_reports_project_index(trace_id,
                                     project_id,
                                     filter_expression=None,
                                     convert_response=None,
                                     scan_index_forward=True):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query_index(trace_id, Tables.PM_REPORTS, PROJECT_INDEX,
                                  key_conditions, filter_expression,
                                  scan_index_forward)

    if convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_REPORT)

    return common_utils.response(result, pm_logger)


def query_reports_filter_organization(trace_id, project_id, organization_id,
                                      convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('OrganizationID').eq(organization_id)
    reports = query_list_reports_project_index(trace_id, project_id, filter,
                                               convert_response, False)
    return common_utils.response(reports, pm_logger)


def query_report_filter_organization_project(
    trace_id, report_id, project_id, organization_id, status=None,
        convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('OrganizationID').eq(
        organization_id) & Attr('ProjectID').eq(project_id)
    if (status):
        filter = filter.__and__(Attr('ReportStatus').eq(status))
    result = query_report_filter(trace_id, report_id, filter, convert_response)
    return common_utils.response(result, pm_logger)
