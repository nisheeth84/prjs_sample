import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from pathlib import Path
from premembers.repository import pm_affiliation, pm_latestCheckResult
from premembers.repository import pm_projects, pm_checkResultItems
from premembers.repository import pm_checkResults, pm_batchJobDefs
from premembers.repository import pm_checkHistory
from premembers.repository.const import ExclusionFlag
from premembers.const.msg_const import MsgConst
from tests import event_create
from operator import itemgetter
from premembers.common import common_utils, aws_common, FileUtils
from premembers.check.handler import awschecks


trace_id = common_utils.get_uuid4()
mail_address = "test-user{}@example.com"
user_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
organization_id = common_utils.get_uuid4()
project_id = common_utils.get_uuid4()
check_history_id = common_utils.get_uuid4()
check_result_id = common_utils.get_uuid4()
check_result_item_id = common_utils.get_uuid4()
check_item_code = common_utils.get_uuid4()
date_now = common_utils.get_current_date()
project_id_not_data = common_utils.get_uuid4()

LIST_CHECK_ITEM_CODE = [
    'CHECK_CIS_ITEM_1_01', 'CHECK_CIS12_ITEM_1_01', 'CHECK_ASC_ITEM_01_01',
    'CHECK_IBP_ITEM_01_01'
]

result_json_path = "unit-test-check-history-id/3c9381d8-9267-47b8-83b9-4281250f8d96/88d79ab9-834f-45ac-b220-361d272bff49/109054975408/check_result/{}.json"
max_retry = 3
job_definition = "arn:aws:batch:ap-northeast-1:216054658829:job-definition/premembers-check-batch:2"
list_code = ['CHECK_SECURITY_EXEC', 'CHECK_SECURITY_AGGREGATE', 'CHECK_SECURITY_REPORT']
job_queue = "JobQueue"

check_cis_item_1_01_json = {
    'AWSAccount': '109054975408',
    'CheckResults': [
        {
            'Region': 'Global',
            'Level': 21,
            'DetectionItem': {
                'UseRootAccountAbnormity': True,
                'PasswordLastUsed': '2017-11-07 11:55:07',
                'AccessKey1LastUsedDate': '2017-11-07 11:55:07',
                'AccessKey2LastUsedDate': '2017-11-07 11:55:07'
            }
        }
    ],
    'DateTime': '2017-11-07 11:55:07'
}

check_cis12_item_1_01_json = {
    'AWSAccount': '109054975408',
    'CheckResults': [
        {
            'Region': 'Global',
            'Level': 21,
            'DetectionItem': {
                'UseRootAccountAbnormity': True,
                'PasswordLastUsed': '2017-11-07 11:55:07',
                'AccessKey1LastUsedDate': '2017-11-07 11:55:07',
                'AccessKey2LastUsedDate': '2017-11-07 11:55:07'
            }
        }
    ],
    'DateTime': '2017-11-07 11:55:07'
}

check_asc_item_01_01_json = {
    'AWSAccount': '109054975408',
    'CheckResults': [
        {
            'Region': 'Global',
            'Level': 21,
            'DetectionItem': {
                'RootAccountAccessKeyAbnormity': True
            }
        }
    ],
    'DateTime': '2017-11-07 11:55:07'
}

check_ibp_item_01_01_json = {
    "AWSAccount": "109054975408",
    "CheckResults": [
        {
            "Region": "Global",
            "Level": 21,
            "DetectionItem": {
                "UserName": "serverless-user",
                "ManagedPoliciesAttachedAbnormity": True
            }
        }
    ],
    "DateTime": "2019-01-18 04:44:38"
}

projects_template = {
    "ProjectID": project_id,
    "ProjectName": "ProjectName",
    "Description": "DescriptionID11",
    "OrganizationID": organization_id
}

check_history_template = {
    'CheckHistoryID': check_history_id,
    'OrganizationID': organization_id,
    'ProjectID': project_id,
    'CheckCode': 'check_code',
    'CheckStatus': 6,
    'ErrorCode': 'error_code',
    'ExecutedType': 'executed_type',
    'ReportFilePath': 'report_file_path',
    'ExecutedDateTime': 'executed_date_time',
    'ExecuteUserID': 'execute_user_id',
    'TimeToLive': 'time_to_live',
    'CreatedAt': date_now,
    'UpdatedAt': date_now
}

affiliation_template = {
    "MailAddress": mail_address.format(str(0)),
    "UserID": user_id,
    "Authority": 0,
    "OrganizationID": organization_id,
    "InvitationStatus": 1,
}

latest_check_result_template = {
    "OrganizationID": organization_id,
    "ProjectID": project_id,
    "CheckHistoryID": check_history_id
}

check_results_template = {
    'CheckResultID': check_result_id,
    'CheckHistoryID': check_history_id,
    'CheckRuleCode': "CheckRuleCode",
    'OrganizationID': organization_id,
    'OrganizationName': "organization_name",
    'ProjectID': project_id,
    'ProjectName': "project_name",
    'AWSAccountCoopID': "AWSAccountCoopID",
    'AWSAccount': "aws_account",
    'SortCode': "sort_code",
    'OKCount': 2,
    'CriticalCount': 3,
    'NGCount': 4,
    'ExecutedDateTime': date_now,
    'TimeToLive': 1264644,
    'AWSAccountName': "aws_account_name"
}

check_results_items_template = {
    'CheckResultItemID': check_result_item_id,
    'CheckHistoryID': check_history_id,
    'CheckResultID': check_result_id,
    'CheckItemCode': check_item_code,
    'OrganizationID': organization_id,
    'OrganizationName': "organization_name",
    'ProjectID': project_id,
    'ProjectName': "project_name",
    'AWSAccountCoopID': "aws_account_coop_id",
    'AWSAccount': "aws_account",
    'SortCode': "sort_code",
    'CheckResult': 1,
    'ResultJsonPath': result_json_path,
    'ResultCsvPath': "result_csv_path",
    'ExecutedDateTime': date_now,
    'TimeToLive': 64000,
    'AssessmentFlag': -1,
    'CreatedAt': date_now,
    'UpdatedAt': date_now,
    'AWSAccountName': "aws_account_name"
}

batch_job_def_template = {
    "MaxRetry": max_retry,
    "EnvironmentList": [],
    "Code": "CHECK_SECURITY_EXEC",
    "JobQueue": job_queue,
    "JobDefinition": job_definition
}


class TestAwsChecks(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        # Create CheckHistory
        pm_checkHistory.create(trace_id,
                               check_history_template['CheckHistoryID'],
                               check_history_template['OrganizationID'],
                               check_history_template['ProjectID'],
                               check_history_template['CheckCode'],
                               check_history_template['CheckStatus'],
                               check_history_template['ErrorCode'],
                               check_history_template['ExecutedType'],
                               check_history_template['ReportFilePath'],
                               check_history_template['ExecutedDateTime'],
                               check_history_template['TimeToLive'],
                               check_history_template['ExecuteUserID'])
        # Create Projects
        pm_projects.create_projects(trace_id, projects_template['ProjectID'],
                                    projects_template['ProjectName'],
                                    projects_template['Description'],
                                    projects_template['OrganizationID'])

        pm_projects.create_projects(trace_id, project_id_not_data,
                                    projects_template['ProjectName'],
                                    projects_template['Description'],
                                    projects_template['OrganizationID'])

        # Create Projects : no data checkitemresult
        pm_projects.create_projects(
            trace_id, projects_template['ProjectID'] + 'nodata',
            projects_template['ProjectName'], projects_template['Description'],
            projects_template['OrganizationID'])

        # Create Projects :errorpath
        pm_projects.create_projects(
            trace_id, projects_template['ProjectID'] + 'errorpath',
            projects_template['ProjectName'], projects_template['Description'],
            projects_template['OrganizationID'])

        # Create pm_lastestCheckResult : no data checkitemresult
        pm_latestCheckResult.create(
            trace_id, projects_template['OrganizationID'],
            projects_template['ProjectID'] + "nodata",
            latest_check_result_template['CheckHistoryID'] + "nodata")

        # Create pm_lastestCheckResult : errorpath
        pm_latestCheckResult.create(
            trace_id, projects_template['OrganizationID'],
            projects_template['ProjectID'] + "errorpath",
            latest_check_result_template['CheckHistoryID'] + "errorpath")

        # Create PM_CheckResultsItems ResultJsonPath error
        pm_checkResultItems.create(
            trace_id,
            check_results_items_template['CheckResultItemID'] + "errorpath",
            check_results_items_template['CheckHistoryID'] + 'errorpath',
            check_results_items_template['CheckResultID'],
            check_results_items_template['CheckItemCode'],
            check_results_items_template['OrganizationID'],
            check_results_items_template['OrganizationName'],
            check_results_items_template['ProjectID'] + 'errorpath',
            check_results_items_template['ProjectName'],
            check_results_items_template['AWSAccountCoopID'],
            check_results_items_template['AWSAccount'],
            check_results_items_template['SortCode'],
            check_results_items_template['CheckResult'],
            '"errorpath"',
            check_results_items_template['ResultCsvPath'],
            check_results_items_template['ExecutedDateTime'],
            check_results_items_template['TimeToLive'],
            check_results_items_template['AWSAccountName'],
            check_results_items_template['AssessmentFlag'],
            ExclusionFlag.Disable
        )
        num = 1
        while num < 4:
            # Create Affiliation
            tmp_affiliation = copy.copy(affiliation_template)
            tmp_affiliation['MailAddress'] = mail_address.format(str(num))
            tmp_affiliation['UserID'] = user_id.format(str(num))
            tmp_affiliation['Authority'] = num
            pm_affiliation.create_affiliation(
                trace_id, tmp_affiliation['MailAddress'],
                tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
                tmp_affiliation['Authority'],
                tmp_affiliation['InvitationStatus'])

            # Create PM_LatestCheckResult
            project_id_tmp = project_id
            if num > 1:
                project_id_tmp = project_id + str(num)
            pm_latestCheckResult.create(
                trace_id, tmp_affiliation['OrganizationID'], project_id_tmp,
                latest_check_result_template['CheckHistoryID'])

            # Create PM_CheckResults
            pm_checkResults.create(
                trace_id, check_result_id + str(num),
                check_results_template['CheckHistoryID'],
                check_results_template['CheckRuleCode'], organization_id,
                check_results_template['OrganizationName'], project_id,
                check_results_template['ProjectName'],
                check_results_template['AWSAccountCoopID'],
                check_results_template['AWSAccount'],
                check_results_template['SortCode'],
                check_results_template['OKCount'],
                check_results_template['CriticalCount'],
                check_results_template['NGCount'],
                check_results_template['ExecutedDateTime'],
                check_results_template['TimeToLive'],
                check_results_template["AWSAccountName"])
            if num != 3:
                attribute = {
                    'ManagedCount': {
                        "Value": 8
                    },
                    'ErrorCount': {
                        "Value": 9
                    }
                }
                pm_checkResults.update(trace_id, check_result_id + str(num),
                                       attribute)

            # Create PM_CheckHistory
            pm_checkHistory.create(
                trace_id, check_history_template['CheckHistoryID'] + str(num),
                check_history_template['OrganizationID'],
                check_history_template['ProjectID'],
                check_history_template['CheckCode'],
                check_history_template['CheckStatus'],
                check_history_template['ErrorCode'],
                check_history_template['ExecutedType'],
                check_history_template['ReportFilePath'],
                check_history_template['ExecutedDateTime'],
                check_history_template['TimeToLive'],
                check_history_template['ExecuteUserID'])

            num += 1

        # Create PM_CheckResultsItems
        for index in range(len(LIST_CHECK_ITEM_CODE)):
            check_item_code = LIST_CHECK_ITEM_CODE[index]
            result_json_path_tmp = result_json_path.format(check_item_code)
            if (aws_common.check_exists_file_s3(
                    trace_id, "S3_CHECK_BUCKET",
                    result_json_path_tmp)) is False:
                if (check_item_code == "CHECK_CIS_ITEM_1_01"):
                    check_result_json = check_cis_item_1_01_json
                if (check_item_code == "CHECK_CIS12_ITEM_1_01"):
                    check_result_json = check_cis12_item_1_01_json
                elif (check_item_code == "CHECK_ASC_ITEM_01_01"):
                    check_result_json = check_asc_item_01_01_json
                elif (check_item_code == "CHECK_IBP_ITEM_01_01"):
                    check_result_json = check_ibp_item_01_01_json
                FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                      check_result_json, result_json_path_tmp)

            pm_checkResultItems.create(
                trace_id,
                check_results_items_template['CheckResultItemID'] + str(index),
                check_results_items_template['CheckHistoryID'],
                check_results_items_template['CheckResultID'], check_item_code,
                check_results_items_template['OrganizationID'],
                check_results_items_template['OrganizationName'],
                check_results_items_template['ProjectID'],
                check_results_items_template['ProjectName'],
                check_results_items_template['AWSAccountCoopID'],
                check_results_items_template['AWSAccount'],
                check_results_items_template['SortCode'],
                check_results_items_template['CheckResult'],
                result_json_path_tmp,
                check_results_items_template['ResultCsvPath'],
                check_results_items_template['ExecutedDateTime'],
                check_results_items_template['TimeToLive'],
                check_results_items_template['AWSAccountName'],
                check_results_items_template['AssessmentFlag'],
                ExclusionFlag.Disable)

        for code in list_code:
            # Create BatchJobDefs
            tmp_batch_job_def = copy.copy(batch_job_def_template)
            tmp_batch_job_def["Code"] = code
            pm_batchJobDefs.create_report_job_def(
                trace_id, tmp_batch_job_def["Code"],
                tmp_batch_job_def["JobDefinition"] + code,
                tmp_batch_job_def["JobQueue"] + code,
                tmp_batch_job_def["MaxRetry"],
                tmp_batch_job_def["EnvironmentList"])

    def tearDown(self):
        num = 1
        while num < 4:
            pm_affiliation.delete_affiliation(
                user_id.format(str(num)), organization_id)
            project_id_tmp = project_id
            if num > 1:
                project_id_tmp = project_id + str(num)
            pm_latestCheckResult.delete(trace_id, organization_id,
                                        project_id_tmp)
            pm_checkResults.delete(trace_id, check_result_id + str(num))
            pm_checkHistory.delete(
                trace_id, check_history_template['CheckHistoryID'] + str(num))
            num += 1

        for index in range(len(LIST_CHECK_ITEM_CODE)):
            pm_checkResultItems.delete(trace_id,
                                       check_result_item_id + str(index))

        pm_projects.delete_projects(trace_id, project_id)
        pm_projects.delete_projects(trace_id, project_id_not_data)
        pm_projects.delete_projects(trace_id,
                                    projects_template['ProjectID'] + 'nodata')
        pm_projects.delete_projects(
            trace_id, projects_template['ProjectID'] + 'errorpath')
        pm_latestCheckResult.delete(trace_id, organization_id,
                                    projects_template['ProjectID'] + 'nodata')
        pm_latestCheckResult.delete(
            trace_id, organization_id,
            projects_template['ProjectID'] + 'errorpath')
        pm_checkResultItems.delete(trace_id,
                                   check_result_item_id + "errorpath")
        pm_checkHistory.delete(trace_id,
                               check_history_template['CheckHistoryID'])
        for code in list_code:
            batch_job_def_template["Code"] = code
            pm_batchJobDefs.delete_report_job_def(
                trace_id, batch_job_def_template["Code"])

    def test_get_security_check_summary_success(self):
        test_user_id = user_id.format(str(1))
        # handler
        event_mock = event_create.get_event_object(trace_id=test_user_id)
        response = awschecks.get_security_check_summary_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        okCount = response_body["okCount"]
        ngCount = response_body['ngCount']
        criticalCount = response_body['criticalCount']
        managedCount = response_body['managedCount']
        errorCount = response_body['errorCount']

        # Check data
        self.assertEqual(okCount, 18)
        self.assertEqual(ngCount, 36)
        self.assertEqual(criticalCount, 27)
        self.assertEqual(managedCount, 48)
        self.assertEqual(errorCount, 54)
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_list_latest_check_result_error(self):
        test_user_id = "not_exist"
        # handler
        event_mock = event_create.get_event_object(trace_id=test_user_id)
        response = awschecks.get_security_check_summary_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        body = response['body']

        # check data
        self.assertEqual(body, '[]')
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_security_check_detail_success(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])

        for response_body in response_bodys:
            check_history_id_tmp = response_body['checkHistoryId']
            check_result_id = response_body['checkResultId']
            check_item_code = response_body['checkItemCode']
            organization_name = response_body['organizationName']
            project_name = response_body['projectName']
            aws_account = response_body['awsAccount']
            check_result = response_body['checkResult']
            executed_date_time = response_body['executedDateTime']
            aws_account_name_tmp = response_body['awsAccountName']
            exclusion_flag = response_body['exclusionFlag']

            # Get data Dynamodb
            check_results_items_database = pm_checkResultItems.query_key(
                trace_id, response_body['id'])

            # Check data
            self.assertEqual(check_history_id_tmp,
                             check_results_items_database['CheckHistoryID'])
            self.assertEqual(check_result_id,
                             check_results_items_database['CheckResultID'])
            self.assertEqual(check_item_code,
                             check_results_items_database['CheckItemCode'])
            self.assertEqual(organization_name,
                             check_results_items_database['OrganizationName'])
            self.assertEqual(project_name,
                             check_results_items_database['ProjectName'])
            self.assertEqual(aws_account,
                             check_results_items_database['AWSAccount'])
            self.assertEqual(check_result,
                             check_results_items_database['CheckResult'])
            self.assertEqual(aws_account_name_tmp,
                             check_results_items_database['AWSAccountName'])
            self.assertEqual(executed_date_time,
                             check_results_items_database['ExecutedDateTime'])
            self.assertEqual(exclusion_flag,
                             check_results_items_database['ExclusionFlag'])

        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_security_check_detail_success_exclusion_flag_is_1(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id
            })

        # create table pm_checkResultItems contain exclusion_flag = 1
        pm_checkResultItems.create(
            trace_id,
            check_results_items_template['CheckResultItemID'] + str(5),
            check_results_items_template['CheckHistoryID'],
            check_results_items_template['CheckResultID'],
            check_results_items_template['CheckItemCode'],
            check_results_items_template['OrganizationID'],
            check_results_items_template['OrganizationName'],
            check_results_items_template['ProjectID'],
            check_results_items_template['ProjectName'],
            check_results_items_template['AWSAccountCoopID'],
            check_results_items_template['AWSAccount'],
            check_results_items_template['SortCode'],
            check_results_items_template['CheckResult'],
            check_results_items_template['ResultJsonPath'].format(
                "CHECK_CIS_ITEM_1_01"),
            check_results_items_template['ResultCsvPath'],
            check_results_items_template['ExecutedDateTime'],
            check_results_items_template['TimeToLive'],
            check_results_items_template['AWSAccountName'],
            check_results_items_template['AssessmentFlag'],
            ExclusionFlag.Enable)

        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])

        for response_body in response_bodys:
            check_history_id_tmp = response_body['checkHistoryId']
            check_result_id = response_body['checkResultId']
            check_item_code = response_body['checkItemCode']
            organization_name = response_body['organizationName']
            project_name = response_body['projectName']
            aws_account = response_body['awsAccount']
            check_result = response_body['checkResult']
            executed_date_time = response_body['executedDateTime']
            aws_account_name_tmp = response_body['awsAccountName']
            exclusion_flag = response_body['exclusionFlag']

            # Get data Dynamodb
            check_results_items_database = pm_checkResultItems.query_key(
                trace_id, response_body['id'])

            # Check data
            self.assertEqual(check_history_id_tmp,
                             check_results_items_database['CheckHistoryID'])
            self.assertEqual(check_result_id,
                             check_results_items_database['CheckResultID'])
            self.assertEqual(check_item_code,
                             check_results_items_database['CheckItemCode'])
            self.assertEqual(organization_name,
                             check_results_items_database['OrganizationName'])
            self.assertEqual(project_name,
                             check_results_items_database['ProjectName'])
            self.assertEqual(aws_account,
                             check_results_items_database['AWSAccount'])
            self.assertEqual(check_result,
                             check_results_items_database['CheckResult'])
            self.assertEqual(aws_account_name_tmp,
                             check_results_items_database['AWSAccountName'])
            self.assertEqual(executed_date_time,
                             check_results_items_database['ExecutedDateTime'])
            self.assertEqual(exclusion_flag,
                             check_results_items_database['ExclusionFlag'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        pm_checkResultItems.delete(trace_id,
                                   check_results_items_template['CheckResultItemID'] + str(5))

    def test_get_security_check_detail_success_group_filter_cis(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id,
                "groupFilter": 'CIS'
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])
        response_bodys = sorted(response_bodys, key=itemgetter('checkItemCode'))
        for response_body in response_bodys:
            check_history_id_tmp = response_body['checkHistoryId']
            check_result_id = response_body['checkResultId']
            organization_name = response_body['organizationName']
            project_name = response_body['projectName']
            aws_account = response_body['awsAccount']
            check_result = response_body['checkResult']
            executed_date_time = response_body['executedDateTime']
            aws_account_name_tmp = response_body['awsAccountName']
            exclusion_flag = response_body['exclusionFlag']

            # Get data Dynamodb
            check_results_items_database = pm_checkResultItems.query_key(
                trace_id, response_body['id'])

            # Check data
            self.assertEqual(check_history_id_tmp,
                             check_results_items_database['CheckHistoryID'])
            self.assertEqual(check_result_id,
                             check_results_items_database['CheckResultID'])
            self.assertEqual(organization_name,
                             check_results_items_database['OrganizationName'])
            self.assertEqual(project_name,
                             check_results_items_database['ProjectName'])
            self.assertEqual(aws_account,
                             check_results_items_database['AWSAccount'])
            self.assertEqual(check_result,
                             check_results_items_database['CheckResult'])
            self.assertEqual(aws_account_name_tmp,
                             check_results_items_database['AWSAccountName'])
            self.assertEqual(executed_date_time,
                             check_results_items_database['ExecutedDateTime'])
            self.assertEqual(exclusion_flag,
                             check_results_items_database['ExclusionFlag'])
        self.assertEqual(response_bodys[0]['checkItemCode'], 'CHECK_CIS12_ITEM_1_01')
        self.assertEqual(response_bodys[1]['checkItemCode'], 'CHECK_CIS_ITEM_1_01')
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_security_check_detail_success_group_filter_asc(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id,
                "groupFilter": 'ASC'
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])

        for response_body in response_bodys:
            check_history_id_tmp = response_body['checkHistoryId']
            check_result_id = response_body['checkResultId']
            check_item_code = response_body['checkItemCode']
            organization_name = response_body['organizationName']
            project_name = response_body['projectName']
            aws_account = response_body['awsAccount']
            check_result = response_body['checkResult']
            executed_date_time = response_body['executedDateTime']
            aws_account_name_tmp = response_body['awsAccountName']
            exclusion_flag = response_body['exclusionFlag']

            # Get data Dynamodb
            check_results_items_database = pm_checkResultItems.query_key(
                trace_id, response_body['id'])

            # Check data
            self.assertEqual(check_history_id_tmp,
                             check_results_items_database['CheckHistoryID'])
            self.assertEqual(check_result_id,
                             check_results_items_database['CheckResultID'])
            self.assertEqual(check_item_code, 'CHECK_ASC_ITEM_01_01')
            self.assertEqual(organization_name,
                             check_results_items_database['OrganizationName'])
            self.assertEqual(project_name,
                             check_results_items_database['ProjectName'])
            self.assertEqual(aws_account,
                             check_results_items_database['AWSAccount'])
            self.assertEqual(check_result,
                             check_results_items_database['CheckResult'])
            self.assertEqual(aws_account_name_tmp,
                             check_results_items_database['AWSAccountName'])
            self.assertEqual(executed_date_time,
                             check_results_items_database['ExecutedDateTime'])
            self.assertEqual(exclusion_flag,
                             check_results_items_database['ExclusionFlag'])

        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_security_check_detail_success_group_filter_ibp(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id,
                "groupFilter": 'IBP'
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])

        for response_body in response_bodys:
            check_history_id_tmp = response_body['checkHistoryId']
            check_result_id = response_body['checkResultId']
            check_item_code = response_body['checkItemCode']
            organization_name = response_body['organizationName']
            project_name = response_body['projectName']
            aws_account = response_body['awsAccount']
            check_result = response_body['checkResult']
            executed_date_time = response_body['executedDateTime']
            aws_account_name_tmp = response_body['awsAccountName']
            exclusion_flag = response_body['exclusionFlag']

            # Get data Dynamodb
            check_results_items_database = pm_checkResultItems.query_key(
                trace_id, response_body['id'])

            # Check data
            self.assertEqual(check_history_id_tmp,
                             check_results_items_database['CheckHistoryID'])
            self.assertEqual(check_result_id,
                             check_results_items_database['CheckResultID'])
            self.assertEqual(check_item_code, 'CHECK_IBP_ITEM_01_01')
            self.assertEqual(organization_name,
                             check_results_items_database['OrganizationName'])
            self.assertEqual(project_name,
                             check_results_items_database['ProjectName'])
            self.assertEqual(aws_account,
                             check_results_items_database['AWSAccount'])
            self.assertEqual(check_result,
                             check_results_items_database['CheckResult'])
            self.assertEqual(aws_account_name_tmp,
                             check_results_items_database['AWSAccountName'])
            self.assertEqual(executed_date_time,
                             check_results_items_database['ExecutedDateTime'])
            self.assertEqual(exclusion_flag,
                             check_results_items_database['ExclusionFlag'])

        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_security_check_detail_success_group_filter_other(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id,
                "groupFilter": 'other'
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])
        self.assertEqual(response_bodys, [])
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_security_check_detail_error_access_authority(self):
        test_user_id = "NOTEXIST"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_get_security_check_detail_error_validate_resource(self):
        test_user_id = user_id.format(str(1))
        project_id = "not_exist"
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_AWS_401['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_AWS_401['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_get_security_check_detail_error_check_history_no_data(self):
        test_user_id = user_id.format(str(1))
        project_id = project_id_not_data
        organization_id = projects_template['OrganizationID']
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        self.assertEqual(response['body'], "[]")

    def test_get_security_check_detail_error_result_item_not_data(self):
        test_user_id = user_id.format(str(1))
        project_id = projects_template['ProjectID'] + "nodata"
        organization_id = projects_template['OrganizationID']
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id + "nodata"
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        self.assertEqual(response['body'], "[]")

    def test_get_security_check_detail_error_file_not_exist(self):
        test_user_id = user_id.format(str(1))
        project_id = projects_template['ProjectID'] + "errorpath"
        organization_id = projects_template['OrganizationID']
        # handler
        check_history_id = check_results_items_template['CheckHistoryID']
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id + "errorpath"
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_S3_702['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_S3_702['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR)

    def test_get_security_check_detail_not_exist_check_history_id(self):
        test_user_id = user_id.format(str(1))
        check_history_id = "NOTEXIST"
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "checkHistoryId": check_history_id
            })
        response = awschecks.get_security_check_detail_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.NOT_FOUND)

    def test_get_securitycheck_awsacntsummary_success(self):
        test_user_id = user_id.format(str(1))
        # handler
        aws_account = "aws_account"

        # event_mock = event_create.get_event_object(trace_id=test_user_id)

        path_parameters = {
            "aws_account": aws_account
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "awsAccount": aws_account
            })

        responses = awschecks.get_securitycheck_awsacntsummary_handler(
            event_mock, {})
        response = json.loads(responses['body'])
        response = sorted(response, key=itemgetter('checkResultId'))
        result_response = response[0]

        # get data response
        aws_account_name_tmp = result_response['awsAccountName']
        organizationName = result_response['organizationName']
        ngCount = result_response['ngCount']
        projectName = result_response['projectName']
        awsAccount = result_response['awsAccount']
        checkResultId = result_response['checkResultId']
        number = checkResultId[len(checkResultId) - 1]
        projectId = result_response['projectId']
        organizationId = result_response['organizationId']
        executedDateTime = result_response['executedDateTime']
        awsAccountCoopId = result_response['awsAccountCoopId']
        criticalCount = result_response['criticalCount']
        okCount = result_response['okCount']
        managedCount = result_response['managedCount']
        errorCount = result_response['errorCount']
        status_code = responses['statusCode']

        self.assertEqual(organizationName, 'organization_name')
        self.assertEqual(ngCount, 4)
        self.assertEqual(projectName, 'project_name')
        self.assertEqual(awsAccount, 'aws_account')
        self.assertEqual(aws_account_name_tmp, "aws_account_name")
        self.assertEqual(checkResultId, check_result_id + number)
        self.assertEqual(projectId, project_id)
        self.assertEqual(organizationId, organization_id)
        self.assertEqual(executedDateTime, date_now)
        self.assertEqual(awsAccountCoopId, 'AWSAccountCoopID')
        self.assertEqual(criticalCount, 3)
        self.assertEqual(okCount, 2)
        self.assertEqual(managedCount, 8)
        self.assertEqual(errorCount, 9)

        # For records that do not contain managedCount, errorCount properties
        self.assertEqual(response[2]['managedCount'], 0)
        self.assertEqual(response[2]['errorCount'], 0)

        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_list_latest_check_result_error(self):
        test_user_id = "not_exist"
        # handler
        aws_account = "aws_account"

        path_parameters = {
            "aws_account": aws_account
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "awsAccount": aws_account
            })

        # handler
        event_mock = event_create.get_event_object(trace_id=trace_id)
        response = awschecks.get_securitycheck_awsacntsummary_handler(
            event_mock, {})

        # Get data response
        status_code = response['statusCode']
        body = response['body']

        # check data
        self.assertEqual(body, '[]')
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_securitycheck_awsacntsummary_not_assign_awsaccount(self):
        test_user_id = user_id.format(str(1))
        event_mock = event_create.get_event_object(trace_id=test_user_id)

        responses = awschecks.get_securitycheck_awsacntsummary_handler(
            event_mock, {})

        response = json.loads(responses['body'])
        result_response = response[0]
        # get data response
        organizationName = result_response['organizationName']
        ngCount = result_response['ngCount']
        projectName = result_response['projectName']
        awsAccount = result_response['awsAccount']
        checkResultId = result_response['checkResultId']
        number = checkResultId[len(checkResultId) - 1]
        projectId = result_response['projectId']
        organizationId = result_response['organizationId']
        executedDateTime = result_response['executedDateTime']
        awsAccountCoopId = result_response['awsAccountCoopId']
        criticalCount = result_response['criticalCount']
        okCount = result_response['okCount']
        status_code = responses['statusCode']

        self.assertEqual(organizationName, 'organization_name')
        self.assertEqual(ngCount, 4)
        self.assertEqual(projectName, 'project_name')
        self.assertEqual(awsAccount, 'aws_account')
        self.assertEqual(checkResultId, check_result_id + number)
        self.assertEqual(projectId, project_id)
        self.assertEqual(organizationId, organization_id)
        self.assertEqual(executedDateTime, date_now)
        self.assertEqual(awsAccountCoopId, 'AWSAccountCoopID')
        self.assertEqual(criticalCount, 3)
        self.assertEqual(okCount, 2)
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_securitycheck_awsacntsummary_not_not_exist_awsaccount(self):
        test_user_id = user_id.format(str(1))
        # handler
        aws_account = "not_exist_awsaccount"

        # event_mock = event_create.get_event_object(trace_id=test_user_id)

        path_parameters = {
            "aws_account": aws_account
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "awsAccount": aws_account
            })

        responses = awschecks.get_securitycheck_awsacntsummary_handler(
            event_mock, {})

        response = json.loads(responses['body'])

        self.assertEqual(response, [])

    def test_execute_security_check_success_lang_ja(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            email=test_mail,
            query_string_parameters={"reportLang": "ja"})
        response = awschecks.execute_security_check_handler(event_mock, {})
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.OK)
        self.assertEqual(response_bodys["organizationId"], organization_id)
        self.assertEqual(response_bodys['projectId'], project_id)
        self.assertEqual(response_bodys['checkCode'], "CHECK_SECURITY")
        self.assertEqual(response_bodys['checkStatus'], 0)
        self.assertEqual(response_bodys['executedType'], "MANUAL")

        # Test ExecuteUserID
        check_history = pm_checkHistory.query_key(trace_id,
                                                  response_bodys["id"])
        self.assertEqual(check_history["ExecuteUserID"], test_user_id)

    def test_execute_security_check_success_lang_en(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            email=test_mail,
            query_string_parameters={"reportLang": "en"})
        response = awschecks.execute_security_check_handler(event_mock, {})
        status_code = response['statusCode']
        response_bodys = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.OK)
        self.assertEqual(response_bodys["organizationId"], organization_id)
        self.assertEqual(response_bodys['projectId'], project_id)
        self.assertEqual(response_bodys['checkCode'], "CHECK_SECURITY")
        self.assertEqual(response_bodys['checkStatus'], 0)
        self.assertEqual(response_bodys['executedType'], "MANUAL")

        # Test ExecuteUserID
        check_history = pm_checkHistory.query_key(trace_id,
                                                  response_bodys["id"])
        self.assertEqual(check_history["ExecuteUserID"], test_user_id)

    def test_execute_security_check_error_access_authority(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = awschecks.execute_security_check_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_execute_security_check_error_validate_resource(self):
        test_user_id = user_id.format(str(2))
        project_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = awschecks.execute_security_check_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_AWS_401['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_AWS_401['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_execute_security_check_error_report_lang_empty(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            email=test_mail,
            query_string_parameters={"reportLang": ""})
        response = awschecks.execute_security_check_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "reportLang")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_execute_security_check_error_report_lang_not_valid(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            email=test_mail,
            query_string_parameters={"reportLang": "vi"})
        response = awschecks.execute_security_check_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "reportLang")
        self.assertEqual(response_error[0]['value'], "vi")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("ja, en"))

    def test_get_security_check_report_url_success(self):
        test_user_id = user_id.format(str(1))
        event_mock = event_create.get_event_object(
            trace_id=test_user_id,
            path_parameters={
                "history_id": check_history_id
            })
        response = awschecks.get_security_check_report_url_handler(
            event_mock, {})
        status_code = response['statusCode']
        self.assertEqual(status_code, HTTPStatus.OK)

    def test_get_security_check_report_url_error_access_authority(self):
        test_user_id = user_id.format(str(0))
        event_mock = event_create.get_event_object(
            trace_id=test_user_id,
            path_parameters={
                "history_id": check_history_id
            })
        response = awschecks.get_security_check_report_url_handler(
            event_mock, {})
        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_get_security_check_report_url_not_exist_check_history(self):
        test_user_id = user_id.format(str(1))
        check_history_id = 'Not_exist'
        event_mock = event_create.get_event_object(
            trace_id=test_user_id,
            path_parameters={
                "history_id": check_history_id
            })
        response = awschecks.get_security_check_report_url_handler(
            event_mock, {})
        # Check data
        message_301 = MsgConst.ERR_301
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_301['code'])
        self.assertEqual(response_body['message'], message_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_list_security_check_reports_susscess(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = awschecks.list_security_check_reports_handler(
            event_mock, {})

        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        response_body = json.loads(response['body'])
        for item in response_body:
            id = item["id"]
            organizationId = item['organizationId']
            projectId = item['projectId']
            checkStatus = item['checkStatus']
            errorCode = item['errorCode']
            executedType = item['executedType']
            executedDateTime = item['executedDateTime']

            check_history_database = pm_checkHistory.query_key(
                trace_id, id, True)

            # Check data
            self.assertEqual(id, check_history_database['id'])
            self.assertEqual(organizationId,
                             check_history_database['organizationId'])
            self.assertEqual(projectId, check_history_database['projectId'])
            self.assertEqual(checkStatus,
                             check_history_database['checkStatus'])
            self.assertEqual(errorCode, check_history_database['errorCode'])
            self.assertEqual(executedType,
                             check_history_database['executedType'])
            self.assertEqual(executedDateTime,
                             check_history_database['executedDateTime'])

    def test_list_security_check_reports_no_recored(self):
        test_user_id = user_id.format(str(1))
        test_project_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awschecks.list_security_check_reports_handler(
            event_mock, {})

        # Check data
        self.assertEqual(response['body'], '[]')
        self.assertEqual(response['statusCode'], HTTPStatus.OK.value)

    def test_list_security_check_reports_error_authority(self):
        test_user_id = "not_exist"
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awschecks.list_security_check_reports_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)
