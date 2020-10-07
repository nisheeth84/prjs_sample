import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from pathlib import Path
from operator import itemgetter
from premembers.repository import pm_affiliation, pm_awsAccountCoops
from premembers.repository import pm_exclusionitems, pm_assessmentItems
from premembers.repository import pm_projects
from premembers.const.msg_const import MsgConst
from tests import event_create
from premembers.common import common_utils
from premembers.check.handler import checkitemsettings
from premembers.const.const import CommonConst

trace_id = common_utils.get_uuid4()
project_id = common_utils.get_uuid4()
project_id_copy = common_utils.get_uuid4()
project_id_update = common_utils.get_uuid4()
aws_account_name = "aws_account_name"
aws_account_name_copy = "aws_account_name_copy"
aws_account = "1232131232132"
aws_account_copy = "1234567891011"
organization_id = common_utils.get_uuid4()
organization_id_copy = common_utils.get_uuid4()
organization_id_update = common_utils.get_uuid4()
date_now = common_utils.get_current_date()
mail_address = "test-user{}@example.com"
user_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
coop_id = common_utils.get_uuid4()
coop_id_copy = common_utils.get_uuid4()

aws_account_template = {
    'CoopID': coop_id,
    'AWSAccount': aws_account,
    'AWSAccountName': aws_account_name,
    'RoleName': "role_name",
    'ExternalID': "external_id",
    'Description': "description",
    'Effective': 1,
    'OrganizationID': organization_id,
    'ProjectID': project_id,
    'CreatedAt': date_now,
    'UpdatedAt': date_now
}

aws_account_copy_template = {
    'CoopID': coop_id_copy,
    'AWSAccount': aws_account_copy,
    'AWSAccountName': aws_account_name_copy,
    'RoleName': "role_name",
    'ExternalID': "external_id",
    'Description': "description",
    'Effective': 1,
    'OrganizationID': organization_id_copy,
    'ProjectID': project_id_copy,
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

check_item_code = "CHECK_CIS12_ITEM_1_15"
exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
    organization_id, project_id, aws_account, check_item_code)
exclusion_item_id_update = CommonConst.EXCLUSIONITEM_ID.format(
    organization_id_update, project_id_update, aws_account_copy,
    check_item_code)
account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
    organization_id, project_id, aws_account)
account_refine_code_copy = CommonConst.ACCOUNT_REFINE_CODE.format(
    organization_id_copy, project_id_copy, aws_account_copy)
account_refine_code_update = CommonConst.ACCOUNT_REFINE_CODE.format(
    organization_id_update, project_id_update, aws_account_copy)
exclusion_template = {
    'ExclusionItemID': exclusion_item_id,
    'OrganizationID': organization_id,
    'ProjectID': project_id,
    'AWSAccount': aws_account,
    'CheckItemCode': check_item_code,
    'ExclusionComment': "ExclusionComment",
    'UserID': user_id,
    'MailAddress': "MailAddress",
    'AccountRefineCode': account_refine_code,
    'TimeToLive': "12345678988524",
    'CreatedAt': date_now,
    'UpdatedAt': date_now
}

exclusion_template_update = {
    'ExclusionItemID': exclusion_item_id_update,
    'OrganizationID': organization_id_update,
    'ProjectID': project_id_update,
    'AWSAccount': aws_account_copy,
    'CheckItemCode': check_item_code,
    'ExclusionComment': "ExclusionComment_update",
    'UserID': user_id,
    'MailAddress': "MailAddress_update",
    'AccountRefineCode': account_refine_code_update,
    'TimeToLive': "12345678988524",
    'CreatedAt': date_now,
    'UpdatedAt': date_now
}

assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
    organization_id, project_id, aws_account, check_item_code)

assessment_item_id_update = CommonConst.ASSESSMENTITEM_ID.format(
    organization_id_update, project_id_update, aws_account_copy,
    check_item_code)

assessment_template = {
    'AssessmentItemID': assessment_item_id,
    'OrganizationID': organization_id,
    'ProjectID': project_id,
    'AWSAccount': aws_account,
    'CheckItemCode': check_item_code,
    'AssessmentComment': "AssessmentComment",
    'UserID': user_id,
    'MailAddress': "MailAddress",
    'TimeToLive': "TimeToLive",
    'AccountRefineCode': account_refine_code,
    'CreatedAt': date_now,
    'UpdatedAt': date_now
}

assessment_template_update = {
    'AssessmentItemID': assessment_item_id_update,
    'OrganizationID': organization_id_update,
    'ProjectID': project_id_update,
    'AWSAccount': aws_account_copy,
    'CheckItemCode': check_item_code,
    'AssessmentComment': "AssessmentComment_update",
    'UserID': user_id,
    'MailAddress': "MailAddress_update",
    'TimeToLive': "TimeToLive",
    'AccountRefineCode': account_refine_code_update,
    'CreatedAt': date_now,
    'UpdatedAt': date_now
}

projects_template = {
    "ProjectID": project_id,
    "ProjectName": "ProjectName",
    "Description": "DescriptionID11",
    "OrganizationID": organization_id
}

LIST_CHECK_ITEM_CODE_COPY = [
    "CHECK_CIS12_ITEM_1_15", "CHECK_CIS12_ITEM_1_17", "CHECK_CIS12_ITEM_1_18"
]

LIST_CHECK_ITEM_CODE = [
    "CHECK_CIS12_ITEM_1_15", "CHECK_CIS12_ITEM_1_17", "CHECK_CIS12_ITEM_1_18",
    "CHECK_CIS12_ITEM_4_04", "CHECK_ASC_ITEM_02_02", "CHECK_ASC_ITEM_05_01",
    "CHECK_ASC_ITEM_06_01", "CHECK_ASC_ITEM_09_01", "CHECK_ASC_ITEM_11_01",
    "CHECK_ASC_ITEM_14_01", "CHECK_ASC_ITEM_15_01", "CHECK_IBP_ITEM_04_01",
    "CHECK_IBP_ITEM_06_01", "CHECK_IBP_ITEM_10_01", "CHECK_IBP_ITEM_13_01",
    "CHECK_IBP_ITEM_14_03"
]

LIST_CHECK_ITEM_CODE_MANAGED = [
    "CHECK_CIS12_ITEM_1_01", "CHECK_CIS12_ITEM_1_12", "CHECK_CIS12_ITEM_1_13",
    "CHECK_CIS12_ITEM_1_14", "CHECK_CIS12_ITEM_1_15", "CHECK_CIS12_ITEM_1_17",
    "CHECK_CIS12_ITEM_1_18", "CHECK_CIS12_ITEM_1_20", "CHECK_ASC_ITEM_01_01",
    "CHECK_IBP_ITEM_01_01"
]


class TestCheckItemSettings(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        # Create pm_awsAccountCoops
        pm_awsAccountCoops.create_awscoops(
            trace_id, aws_account_template['CoopID'],
            aws_account_template['AWSAccount'],
            aws_account_template['AWSAccountName'],
            aws_account_template['RoleName'],
            aws_account_template['ExternalID'],
            aws_account_template['Description'],
            aws_account_template['Effective'],
            aws_account_template['OrganizationID'],
            aws_account_template['ProjectID'])

        # Create PM_ExclusionItems
        pm_exclusionitems.create(
            trace_id, exclusion_template['ExclusionItemID'],
            exclusion_template['OrganizationID'],
            exclusion_template['ProjectID'], exclusion_template['AWSAccount'],
            exclusion_template['CheckItemCode'],
            exclusion_template['TimeToLive'],
            exclusion_template['ExclusionComment'],
            exclusion_template['UserID'], exclusion_template['MailAddress'],
            exclusion_template['AccountRefineCode'])

        # Create pm_assessmentItems
        pm_assessmentItems.create(
            trace_id, assessment_template['AssessmentItemID'],
            assessment_template['OrganizationID'],
            assessment_template['ProjectID'],
            assessment_template['AWSAccount'],
            assessment_template['CheckItemCode'],
            assessment_template['TimeToLive'],
            assessment_template['AssessmentComment'],
            assessment_template['UserID'], assessment_template['MailAddress'],
            assessment_template['AccountRefineCode'])

        # Create Projects
        pm_projects.create_projects(trace_id, projects_template['ProjectID'],
                                    projects_template['ProjectName'],
                                    projects_template['Description'],
                                    projects_template['OrganizationID'])

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
            num += 1

    def tearDown(self):
        num = 1
        while num < 4:
            # Delete Affiliation
            pm_affiliation.delete_affiliation(
                user_id.format(str(num)), organization_id)
            pm_affiliation.delete_affiliation(
                user_id.format(str(num)), organization_id_copy)
            pm_affiliation.delete_affiliation(
                user_id.format(str(num)), organization_id_update)
            num += 1

        # Delete PM_Projects
        pm_projects.delete_projects(trace_id, project_id)

        # Delete PM_ExclusionItems
        for check_item_code_copy in LIST_CHECK_ITEM_CODE_COPY:
            exclusion_item_id = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code_copy)
            pm_exclusionitems.delete(trace_id, exclusion_item_id)
            exclusion_item_id_copy = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id_copy, project_id_copy, aws_account_copy,
                check_item_code_copy)
            pm_exclusionitems.delete(trace_id, exclusion_item_id_copy)
            exclusion_item_id_update = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id_update, project_id_update, aws_account_copy,
                check_item_code_copy)
            pm_exclusionitems.delete(trace_id, exclusion_item_id_update)

        # Delete PM_AssessmentItems
        for check_item_code_copy in LIST_CHECK_ITEM_CODE_COPY:
            assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code_copy)
            pm_assessmentItems.delete(trace_id, assessment_item_id)
            assessment_item_id_copy = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id_copy, project_id_copy, aws_account_copy,
                check_item_code_copy)
            pm_assessmentItems.delete(trace_id, assessment_item_id_copy)
            assessment_item_id_update = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id_update, project_id_update, aws_account_copy,
                check_item_code_copy)
            pm_assessmentItems.delete(trace_id, assessment_item_id_update)

        # Delete pm_awsAccountCoops
        pm_awsAccountCoops.delete_awscoops(trace_id,
                                           aws_account_template["CoopID"])
        pm_awsAccountCoops.delete_awscoops(trace_id,
                                           aws_account_copy_template["CoopID"])

    def create_data_test_api_execute_copy_item_setting(self):
        # Create pm_awsAccountCoops
        pm_awsAccountCoops.create_awscoops(
            trace_id, aws_account_copy_template['CoopID'],
            aws_account_copy_template['AWSAccount'],
            aws_account_copy_template['AWSAccountName'],
            aws_account_copy_template['RoleName'],
            aws_account_copy_template['ExternalID'],
            aws_account_copy_template['Description'],
            aws_account_copy_template['Effective'],
            aws_account_copy_template['OrganizationID'],
            aws_account_copy_template['ProjectID'])

        for check_item_code_copy in LIST_CHECK_ITEM_CODE_COPY:
            # Create PM_ExclusionItems
            exclusion_item_id = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code_copy)
            pm_exclusionitems.create(trace_id, exclusion_item_id,
                                     exclusion_template['OrganizationID'],
                                     exclusion_template['ProjectID'],
                                     exclusion_template['AWSAccount'],
                                     check_item_code_copy,
                                     exclusion_template['TimeToLive'],
                                     exclusion_template['ExclusionComment'],
                                     exclusion_template['UserID'],
                                     exclusion_template['MailAddress'],
                                     exclusion_template['AccountRefineCode'])
            # Create PM_AssessmentItems copy
            assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code_copy)
            pm_assessmentItems.create(trace_id,
                                      assessment_item_id,
                                      assessment_template['OrganizationID'],
                                      assessment_template['ProjectID'],
                                      assessment_template['AWSAccount'],
                                      check_item_code_copy,
                                      assessment_template['TimeToLive'],
                                      assessment_template['AssessmentComment'],
                                      assessment_template['UserID'],
                                      assessment_template['MailAddress'],
                                      assessment_template['AccountRefineCode'])
        # Create PM_ExclusionItems update
        exclusion_item_id_update = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id_update, project_id_update, aws_account_copy,
            check_item_code)
        pm_exclusionitems.create(
            trace_id, exclusion_item_id_update,
            exclusion_template_update['OrganizationID'],
            exclusion_template_update['ProjectID'],
            exclusion_template_update['AWSAccount'], check_item_code,
            exclusion_template_update['TimeToLive'],
            exclusion_template_update['ExclusionComment'],
            exclusion_template_update['UserID'],
            exclusion_template_update['MailAddress'],
            exclusion_template_update['AccountRefineCode'])
        # Create PM_AssessmentItems update
        assessment_item_id_update = CommonConst.ASSESSMENTITEM_ID.format(
            organization_id_update, project_id_update, aws_account_copy,
            check_item_code)
        pm_assessmentItems.create(
            trace_id, assessment_item_id_update,
            assessment_template_update['OrganizationID'],
            assessment_template_update['ProjectID'],
            assessment_template_update['AWSAccount'], check_item_code,
            assessment_template_update['TimeToLive'],
            assessment_template_update['AssessmentComment'],
            assessment_template_update['UserID'],
            assessment_template_update['MailAddress'],
            assessment_template_update['AccountRefineCode'])
        # Create Affiliation
        tmp_affiliation = copy.copy(affiliation_template)
        tmp_affiliation['MailAddress'] = mail_address.format(str(2))
        tmp_affiliation['UserID'] = user_id.format(str(2))
        tmp_affiliation['Authority'] = 2
        pm_affiliation.create_affiliation(
            trace_id, tmp_affiliation['MailAddress'],
            tmp_affiliation['UserID'], organization_id_copy,
            tmp_affiliation['Authority'],
            tmp_affiliation['InvitationStatus'])
        pm_affiliation.create_affiliation(
            trace_id, tmp_affiliation['MailAddress'],
            tmp_affiliation['UserID'], organization_id_update,
            tmp_affiliation['Authority'],
            tmp_affiliation['InvitationStatus'])

    def test_create_exclusion_item_success_user_is_editer(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {"exclusionComment": "チェック項目除外コメント"}
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        aws_account = aws_account_template['AWSAccount']
        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, "CHECK_CIS12_ITEM_1_15")
        account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
            organization_id, project_id, aws_account)
        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(exclusion_item_id, response_body['id'])
        self.assertEqual(organization_id, response_body['organizationId'])
        self.assertEqual(project_id, response_body['projectId'])
        self.assertEqual(aws_account, response_body['awsAccount'])
        self.assertEqual(tmp_exclusion_body['exclusionComment'].strip(),
                         response_body['exclusionComment'])
        self.assertEqual(test_mail, response_body['mailAddress'])
        self.assertEqual(test_user_id, response_body['userId'])
        self.assertEqual(path_parameters['check_item_code'],
                         response_body['checkItemCode'])
        self.assertEqual(account_refine_code,
                         response_body['accountRefineCode'])
        pm_exclusionitems.delete(trace_id, exclusion_item_id)

    def test_create_exclusion_item_success_user_is_owner(self):
        test_user_id = user_id.format(str(3))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {"exclusionComment": "チェック項目除外コメント"}
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        aws_account = aws_account_template['AWSAccount']
        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, "CHECK_CIS12_ITEM_1_15")
        account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
            organization_id, project_id, aws_account)
        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(exclusion_item_id, response_body['id'])
        self.assertEqual(organization_id, response_body['organizationId'])
        self.assertEqual(project_id, response_body['projectId'])
        self.assertEqual(aws_account, response_body['awsAccount'])
        self.assertEqual(tmp_exclusion_body['exclusionComment'].strip(),
                         response_body['exclusionComment'])
        self.assertEqual(test_mail, response_body['mailAddress'])
        self.assertEqual(test_user_id, response_body['userId'])
        self.assertEqual(path_parameters['check_item_code'],
                         response_body['checkItemCode'])
        self.assertEqual(account_refine_code,
                         response_body['accountRefineCode'])
        pm_exclusionitems.delete(trace_id, exclusion_item_id)

    def test_create_exclusion_item_success_exclusion_comment_contain_space(
            self):
        test_user_id = user_id.format(str(3))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {
            "exclusionComment":
            " チェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメント "
        }
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        aws_account = aws_account_template['AWSAccount']
        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, "CHECK_CIS12_ITEM_1_15")
        account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
            organization_id, project_id, aws_account)
        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(exclusion_item_id, response_body['id'])
        self.assertEqual(organization_id, response_body['organizationId'])
        self.assertEqual(project_id, response_body['projectId'])
        self.assertEqual(aws_account, response_body['awsAccount'])
        self.assertEqual(tmp_exclusion_body['exclusionComment'].strip(),
                         response_body['exclusionComment'])
        self.assertEqual(test_mail, response_body['mailAddress'])
        self.assertEqual(test_user_id, response_body['userId'])
        self.assertEqual(path_parameters['check_item_code'],
                         response_body['checkItemCode'])
        self.assertEqual(account_refine_code,
                         response_body['accountRefineCode'])
        pm_exclusionitems.delete(trace_id, exclusion_item_id)

    def test_create_exclusion_item_success_len_exclusion_comment_is_299(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {
            "exclusionComment":
            "チェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメン"
        }
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        aws_account = aws_account_template['AWSAccount']
        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, "CHECK_CIS12_ITEM_1_15")
        account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
            organization_id, project_id, aws_account)
        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(exclusion_item_id, response_body['id'])
        self.assertEqual(organization_id, response_body['organizationId'])
        self.assertEqual(project_id, response_body['projectId'])
        self.assertEqual(aws_account, response_body['awsAccount'])
        self.assertEqual(tmp_exclusion_body['exclusionComment'].strip(),
                         response_body['exclusionComment'])
        self.assertEqual(test_mail, response_body['mailAddress'])
        self.assertEqual(test_user_id, response_body['userId'])
        self.assertEqual(path_parameters['check_item_code'],
                         response_body['checkItemCode'])
        self.assertEqual(account_refine_code,
                         response_body['accountRefineCode'])
        pm_exclusionitems.delete(trace_id, exclusion_item_id)

    def test_create_exclusion_item_success_len_exclusion_comment_is_300(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {
            "exclusionComment":
            "チェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメント"
        }
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        aws_account = aws_account_template['AWSAccount']
        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, "CHECK_CIS12_ITEM_1_15")
        account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
            organization_id, project_id, aws_account)
        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(exclusion_item_id, response_body['id'])
        self.assertEqual(organization_id, response_body['organizationId'])
        self.assertEqual(project_id, response_body['projectId'])
        self.assertEqual(aws_account, response_body['awsAccount'])
        self.assertEqual(tmp_exclusion_body['exclusionComment'].strip(),
                         response_body['exclusionComment'])
        self.assertEqual(test_mail, response_body['mailAddress'])
        self.assertEqual(test_user_id, response_body['userId'])
        self.assertEqual(path_parameters['check_item_code'],
                         response_body['checkItemCode'])
        self.assertEqual(account_refine_code,
                         response_body['accountRefineCode'])
        pm_exclusionitems.delete(trace_id, exclusion_item_id)

    def test_create_exclusion_item_success_exclusion_comment_is_empty(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {"exclusionComment": ""}
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        aws_account = aws_account_template['AWSAccount']
        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, "CHECK_CIS12_ITEM_1_15")
        account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
            organization_id, project_id, aws_account)
        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(exclusion_item_id, response_body['id'])
        self.assertEqual(organization_id, response_body['organizationId'])
        self.assertEqual(project_id, response_body['projectId'])
        self.assertEqual(aws_account, response_body['awsAccount'])
        self.assertEqual(tmp_exclusion_body['exclusionComment'].strip(),
                         response_body['exclusionComment'])
        self.assertEqual(test_mail, response_body['mailAddress'])
        self.assertEqual(test_user_id, response_body['userId'])
        self.assertEqual(path_parameters['check_item_code'],
                         response_body['checkItemCode'])
        self.assertEqual(account_refine_code,
                         response_body['accountRefineCode'])
        pm_exclusionitems.delete(trace_id, exclusion_item_id)

    def test_create_exclusion_item_error_len_exclusion_comment_is_301(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {
            "exclusionComment":
            "チェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントa"
        }
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_303['code'])
        self.assertEqual(response_error[0]['field'], "exclusionComment")
        self.assertEqual(response_error[0]['value'],
                         tmp_exclusion_body['exclusionComment'])
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_303['message'].format(
                             CommonConst.EXCLUSION_COMMENT_MAX_LENGTH))

    def test_create_exclusion_item_error_len_exclusion_comment_great_than_301(
            self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {
            "exclusionComment":
            "チェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントaaaa"
        }
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_303['code'])
        self.assertEqual(response_error[0]['field'], "exclusionComment")
        self.assertEqual(response_error[0]['value'],
                         tmp_exclusion_body['exclusionComment'])
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_303['message'].format(
                             CommonConst.EXCLUSION_COMMENT_MAX_LENGTH))

    def test_create_exclusion_item_error_access_authority(self):
        test_user_id = user_id.format(str(1))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {"exclusionComment": "チェック項目除外コメント"}
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_create_exclusion_item_case_error_invalid_resource(self):
        test_user_id = user_id.format(str(2))
        test_mail = mail_address.format(str(1))

        tmp_exclusion_body = {"exclusionComment": "チェック項目除外コメント"}
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": "coop_id_invalid",
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_exclusion_body),
            email=test_mail)
        response = checkitemsettings.create_excluesion_item_handler(
            event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_AWS_401['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_AWS_401['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_get_excluesion_item_error_access_authority(self):
        # PM_Affiliation.Authority = 1
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.get_excluesion_item_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response_body['description'],
                         message_101['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_get_excluesion_item_error_account_coops_zero_record(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": "not_exist",
            "check_item_code": "CHECK_CIS12_ITEM_1_15"
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.get_excluesion_item_handler(
            event_mock, {})

        # Check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response_body['message'], message_401['message'])
        self.assertEqual(response_body['description'],
                         message_401['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_get_excluesion_item_success(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": exclusion_template['OrganizationID'],
            "project_id": exclusion_template['ProjectID'],
            "coop_id": coop_id,
            "check_item_code": exclusion_template['CheckItemCode']
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.get_excluesion_item_handler(
            event_mock, {})

        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.OK)
        self.assertEqual(response_body['id'],
                         exclusion_template['ExclusionItemID'])
        self.assertEqual(response_body['organizationId'],
                         exclusion_template['OrganizationID'])
        self.assertEqual(response_body['projectId'],
                         exclusion_template['ProjectID'])
        self.assertEqual(response_body['awsAccount'],
                         exclusion_template['AWSAccount'])
        self.assertEqual(response_body['checkItemCode'],
                         exclusion_template['CheckItemCode'])
        self.assertEqual(response_body['exclusionComment'],
                         exclusion_template['ExclusionComment'])
        self.assertEqual(response_body['mailAddress'],
                         exclusion_template['MailAddress'])

    def test_delete_excluesion_item_case_success(self):
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": exclusion_template['CheckItemCode']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.delete_excluesion_item_handler(
            event_mock, {})

        # Check data
        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, check_item_code)

        exclusion_item = pm_exclusionitems.query_key(trace_id,
                                                     exclusion_item_id)

        response_body = json.loads(response['body'])

        # Check data
        self.assertEqual(exclusion_item, None)
        self.assertEqual(response_body, None)
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

    def test_delete_excluesion_item_case_error_access_authority(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": exclusion_template['CheckItemCode']
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.delete_excluesion_item_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_delete_excluesion_item_case_no_record_exclusion_items(self):
        # Create data input
        test_user_id = user_id.format(str(2))

        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": exclusion_template['CheckItemCode']
        }

        exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
            organization_id, project_id, aws_account, check_item_code)
        pm_exclusionitems.delete(trace_id, exclusion_item_id)

        # handler
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)

        response = checkitemsettings.delete_excluesion_item_handler(
            event_mock, {})

        # Check data
        message_301 = MsgConst.ERR_301
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_301['code'])
        self.assertEqual(response_body['message'], message_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_delete_excluesion_item_case_error_no_record_matching_param_coop_id(
            self):
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": "coop_id_no_record",
            "check_item_code": exclusion_template['CheckItemCode']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)

        response = checkitemsettings.delete_excluesion_item_handler(
            event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_AWS_401['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_AWS_401['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_get_assessment_item_error_access_authority(self):
        # PM_Affiliation.Authority = 1
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.get_assessment_item_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response_body['description'],
                         message_101['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_get_assessment_item_error_account_aws_zero_record(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": "not_exist",
            "check_item_code": check_item_code
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.get_assessment_item_handler(
            event_mock, {})

        # Check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response_body['message'], message_401['message'])
        self.assertEqual(response_body['description'],
                         message_401['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_get_assessment_item_success(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": assessment_template['OrganizationID'],
            "project_id": assessment_template['ProjectID'],
            "coop_id": coop_id,
            "check_item_code": assessment_template['CheckItemCode']
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.get_assessment_item_handler(
            event_mock, {})

        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.OK)
        self.assertEqual(response_body['assessmentItemId'],
                         assessment_template['AssessmentItemID'])
        self.assertEqual(response_body['organizationId'],
                         assessment_template['OrganizationID'])
        self.assertEqual(response_body['projectId'],
                         assessment_template['ProjectID'])
        self.assertEqual(response_body['awsAccount'],
                         assessment_template['AWSAccount'])
        self.assertEqual(response_body['checkItemCode'],
                         assessment_template['CheckItemCode'])
        self.assertEqual(response_body['assessmentComment'],
                         assessment_template['AssessmentComment'])
        self.assertEqual(response_body['mailAddress'],
                         assessment_template['MailAddress'])

    def test_create_assessment_item_error_access_authority(self):
        # PM_Affiliation.Authority = 1
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": assessment_template['AssessmentComment']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response_body['description'],
                         message_101['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_create_assessment_item_error_account_aws_zero_record(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": "not_exist",
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": assessment_template['AssessmentComment']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response_body['message'], message_401['message'])
        self.assertEqual(response_body['description'],
                         message_401['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_create_assessment_item_error_parse_json(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": assessment_template['AssessmentComment']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=assessment_body)
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_202['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_202['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_REQUEST_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_create_assessment_item_error_check_item_code_not_valid(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": "NOT_VALID"
        }

        assessment_body = {
            "assessmentComment": assessment_template['AssessmentComment']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

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
        self.assertEqual(response_error[0]['field'], "checkItemCode")
        self.assertEqual(response_error[0]['value'], "NOT_VALID")
        self.assertEqual(
            response_error[0]['message'],
            MsgConst.ERR_VAL_302['message'].format(
                ', '.join(LIST_CHECK_ITEM_CODE)))

    def test_create_assessment_item_error_len_assessment_comment_is_301(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": "果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_303['code'])
        self.assertEqual(response_error[0]['field'], "assessmentComment")
        self.assertEqual(response_error[0]['value'],
                         assessment_body['assessmentComment'])
        self.assertEqual(
            response_error[0]['message'],
            MsgConst.ERR_VAL_303['message'].format(
                CommonConst.ASSESSMENT_COMMENT_MAX_LENGTH))

    def test_create_assessment_item_success_len_assessment_comment_is_300_with_space(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": " 果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果 "
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Get data insert database
        assessment_item = pm_assessmentItems.query_key(trace_id,
                                                       assessment_item_id)

        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.CREATED)
        self.assertIsNotNone(assessment_item)
        pm_assessmentItems.delete(trace_id, assessment_item_id)

    def test_create_assessment_item_success_len_assessment_comment_is_299_with_space(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": " 果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果 "
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Get data insert database
        assessment_item = pm_assessmentItems.query_key(trace_id,
                                                       assessment_item_id)

        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.CREATED)
        self.assertIsNotNone(assessment_item)
        pm_assessmentItems.delete(trace_id, assessment_item_id)

    def test_create_assessment_item_success_len_assessment_comment_is_300(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": "果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果果"
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Get data insert database
        assessment_item = pm_assessmentItems.query_key(trace_id,
                                                       assessment_item_id)

        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.CREATED)
        self.assertIsNotNone(assessment_item)
        pm_assessmentItems.delete(trace_id, assessment_item_id)

    def test_create_assessment_item_success(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id,
            "check_item_code": check_item_code
        }

        assessment_body = {
            "assessmentComment": assessment_template['AssessmentComment']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            email=assessment_template['MailAddress'],
            body=json.dumps(assessment_body))
        response = checkitemsettings.create_assessment_item_handler(
            event_mock, {})

        # Get data insert database
        assessment_item = pm_assessmentItems.query_key(
            trace_id, assessment_item_id, True)

        # Check data database
        self.assertEqual(assessment_item['assessmentItemId'],
                         assessment_template['AssessmentItemID'])
        self.assertEqual(assessment_item['organizationId'],
                         assessment_template['OrganizationID'])
        self.assertEqual(assessment_item['projectId'],
                         assessment_template['ProjectID'])
        self.assertEqual(assessment_item['awsAccount'],
                         assessment_template['AWSAccount'])
        self.assertEqual(assessment_item['checkItemCode'],
                         assessment_template['CheckItemCode'])
        self.assertEqual(assessment_item['assessmentComment'],
                         assessment_template['AssessmentComment'])
        self.assertEqual(assessment_item['mailAddress'],
                         assessment_template['MailAddress'])

        # Check data response
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'], HTTPStatus.CREATED)
        self.assertEqual(response_body['assessmentItemId'],
                         assessment_template['AssessmentItemID'])
        self.assertEqual(response_body['organizationId'],
                         assessment_template['OrganizationID'])
        self.assertEqual(response_body['projectId'],
                         assessment_template['ProjectID'])
        self.assertEqual(response_body['awsAccount'],
                         assessment_template['AWSAccount'])
        self.assertEqual(response_body['checkItemCode'],
                         assessment_template['CheckItemCode'])
        self.assertEqual(response_body['assessmentComment'],
                         assessment_template['AssessmentComment'])
        self.assertEqual(response_body['mailAddress'],
                         assessment_template['MailAddress'])
        pm_assessmentItems.delete(trace_id, assessment_item_id)

    def test_delete_assessment_item_case_success(self):
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": assessment_template['CheckItemCode']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.delete_assessment_item_handler(
            event_mock, {})

        assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
            organization_id, project_id, aws_account, check_item_code)

        assessment_item = pm_assessmentItems.query_key(trace_id,
                                                       assessment_item_id)

        # Check data
        response_body = json.loads(response['body'])

        self.assertEqual(assessment_item, None)
        self.assertEqual(response_body, None)
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

    def test_delete_assessment_item_case_error_access_authority(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": assessment_template['CheckItemCode']
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)
        response = checkitemsettings.delete_assessment_item_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_delete_assessment_item_case_no_record_assessment_item(self):
        # Create data input
        test_user_id = user_id.format(str(2))

        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": aws_account_template["CoopID"],
            "check_item_code": assessment_template['CheckItemCode']
        }

        assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
            organization_id, project_id, aws_account, check_item_code)
        pm_assessmentItems.delete(trace_id, assessment_item_id)

        # handler
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)

        response = checkitemsettings.delete_assessment_item_handler(
            event_mock, {})

        # Check data
        message_301 = MsgConst.ERR_301
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_301['code'])
        self.assertEqual(response_body['message'], message_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_delete_assessment_item_case_error_no_record_matching_param_coop_id(
            self):
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": "coop_id_no_record",
            "check_item_code": assessment_template['CheckItemCode']
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters, trace_id=test_user_id)

        response = checkitemsettings.delete_assessment_item_handler(
            event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_AWS_401['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_AWS_401['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_list_item_settings_error_access_authority(self):
        # PM_Affiliation.Authority = 1
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'ASC'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response_body['description'],
                         message_101['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_list_item_settings_error_project_zero_record_with_project_id(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": "not_exist",
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'ASC'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})

        # Check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response_body['message'], message_401['message'])
        self.assertEqual(response_body['description'],
                         message_401['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_list_item_settings_error_project_zero_record_with_organization_id(self):
        attribute = {'OrganizationID': {"Value": "not_exist"}}
        pm_projects.update_project(trace_id, project_id, attribute, None)

        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'ASC'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})

        # Check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response_body['message'], message_401['message'])
        self.assertEqual(response_body['description'],
                         message_401['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_list_item_settings_error_account_aws_zero_record_with_coop_id(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": "not_exist"
        }
        query_string_parameters = {"groupFilter": 'ASC'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})

        # Check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response_body['message'], message_401['message'])
        self.assertEqual(response_body['description'],
                         message_401['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_list_item_settings_success_exclusion_items_zero_record(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'not_exist_exclusion'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})
        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_item_settings_success_assessment_items_zero_record(self):
        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'not_exist_assessment'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})
        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_item_settings_success_group_filter_cis(self):
        # PM_AWSAccountCoops.Members = 1
        attribute = {'Members': {"Value": 1}}
        pm_awsAccountCoops.update_awscoops(trace_id, coop_id, attribute)

        # PM_ExclusionItems.CheckItemCode = CHECK_CIS12_ITEM_1_12
        attribute = {'CheckItemCode': {"Value": "CHECK_CIS12_ITEM_1_12"}}
        pm_exclusionitems.update(trace_id, exclusion_item_id, attribute)

        # PM_AssessmentItems.CheckItemCode = CHECK_CIS12_ITEM_1_15
        attribute = {'CheckItemCode': {"Value": "CHECK_CIS12_ITEM_1_15"}}
        pm_assessmentItems.update(trace_id, assessment_item_id, attribute)

        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'CIS'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})
        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        response_bodys = json.loads(response['body'])
        for response_body in response_bodys:
            if response_body['checkItemCode'] == 'CHECK_CIS12_ITEM_1_15':
                self.assertEqual(response_body['managedFlag'], 1)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 1)
            elif response_body['checkItemCode'] == 'CHECK_CIS12_ITEM_1_12':
                self.assertEqual(response_body['managedFlag'], 1)
                self.assertEqual(response_body['exclusionFlag'], 1)
                self.assertEqual(response_body['assessmentFlag'], -1)
            elif response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 0)
            else:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], -1)

    def test_list_item_settings_success_group_filter_asc(self):
        # PM_AWSAccountCoops.Members = 1
        attribute = {'Members': {"Value": 1}}
        pm_awsAccountCoops.update_awscoops(trace_id, coop_id, attribute)

        # PM_ExclusionItems.CheckItemCode = CHECK_ASC_ITEM_01_01
        attribute = {'CheckItemCode': {"Value": "CHECK_ASC_ITEM_01_01"}}
        pm_exclusionitems.update(trace_id, exclusion_item_id, attribute)

        # PM_AssessmentItems.CheckItemCode = CHECK_ASC_ITEM_02_02
        attribute = {'CheckItemCode': {"Value": "CHECK_ASC_ITEM_02_02"}}
        pm_assessmentItems.update(trace_id, assessment_item_id, attribute)

        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'ASC'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})
        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        response_bodys = json.loads(response['body'])
        for response_body in response_bodys:
            if response_body['checkItemCode'] == 'CHECK_ASC_ITEM_02_02':
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 1)
            elif response_body['checkItemCode'] == 'CHECK_ASC_ITEM_01_01':
                self.assertEqual(response_body['managedFlag'], 1)
                self.assertEqual(response_body['exclusionFlag'], 1)
                self.assertEqual(response_body['assessmentFlag'], -1)
            elif response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 0)
            else:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], -1)

    def test_list_item_settings_success_group_filter_ipb(self):
        # PM_AWSAccountCoops.Members = 1
        attribute = {'Members': {"Value": 1}}
        pm_awsAccountCoops.update_awscoops(trace_id, coop_id, attribute)

        # PM_ExclusionItems.CheckItemCode = CHECK_IBP_ITEM_01_01
        attribute = {'CheckItemCode': {"Value": "CHECK_IBP_ITEM_01_01"}}
        pm_exclusionitems.update(trace_id, exclusion_item_id, attribute)

        # PM_AssessmentItems.CheckItemCode = CHECK_IBP_ITEM_04_01
        attribute = {'CheckItemCode': {"Value": "CHECK_IBP_ITEM_04_01"}}
        pm_assessmentItems.update(trace_id, assessment_item_id, attribute)

        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": 'ASC'}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})
        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        response_bodys = json.loads(response['body'])
        for response_body in response_bodys:
            if response_body['checkItemCode'] == 'CHECK_IBP_ITEM_01_01':
                self.assertEqual(response_body['managedFlag'], 1)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 1)
            elif response_body['checkItemCode'] == 'CHECK_IBP_ITEM_04_01':
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 1)
                self.assertEqual(response_body['assessmentFlag'], -1)
            elif response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 0)
            else:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], -1)

    def test_list_item_settings_success_group_filter_blank(self):
        # PM_AWSAccountCoops.Members = 1
        attribute = {'Members': {"Value": 1}}
        pm_awsAccountCoops.update_awscoops(trace_id, coop_id, attribute)

        # PM_ExclusionItems.CheckItemCode = CHECK_CIS12_ITEM_1_11
        attribute = {'CheckItemCode': {"Value": "CHECK_CIS12_ITEM_1_11"}}
        pm_exclusionitems.update(trace_id, exclusion_item_id, attribute)

        # PM_AssessmentItems.CheckItemCode = CHECK_ASC_ITEM_02_02
        attribute = {'CheckItemCode': {"Value": "CHECK_ASC_ITEM_02_02"}}
        pm_assessmentItems.update(trace_id, assessment_item_id, attribute)

        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": ''}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})
        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        response_bodys = json.loads(response['body'])
        for response_body in response_bodys:
            if response_body['checkItemCode'] == 'CHECK_CIS12_ITEM_1_11':
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 1)
                self.assertEqual(response_body['assessmentFlag'], -1)
            elif response_body['checkItemCode'] == 'CHECK_ASC_ITEM_02_02':
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 1)
            elif response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 0)
            else:
                if response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE_MANAGED:
                    self.assertEqual(response_body['managedFlag'], 1)
                else:
                    self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], -1)

    def test_list_item_settings_success_members_is_zero(self):
        # PM_AWSAccountCoops.Members = 0
        attribute = {'Members': {"Value": 0}}
        pm_awsAccountCoops.update_awscoops(trace_id, coop_id, attribute)

        # PM_ExclusionItems.CheckItemCode = CHECK_CIS12_ITEM_1_11
        attribute = {'CheckItemCode': {"Value": "CHECK_CIS12_ITEM_1_11"}}
        pm_exclusionitems.update(trace_id, exclusion_item_id, attribute)

        # PM_AssessmentItems.CheckItemCode = CHECK_ASC_ITEM_02_02
        attribute = {'CheckItemCode': {"Value": "CHECK_ASC_ITEM_02_02"}}
        pm_assessmentItems.update(trace_id, assessment_item_id, attribute)

        # PM_Affiliation.Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id
        }
        query_string_parameters = {"groupFilter": ''}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters=query_string_parameters)
        response = checkitemsettings.list_item_settings_handler(
            event_mock, {})
        # Check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        response_bodys = json.loads(response['body'])
        for response_body in response_bodys:
            if response_body['checkItemCode'] == 'CHECK_CIS12_ITEM_1_11':
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 1)
                self.assertEqual(response_body['assessmentFlag'], -1)
            elif response_body['checkItemCode'] == 'CHECK_ASC_ITEM_02_02':
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 1)
            elif response_body['checkItemCode'] in LIST_CHECK_ITEM_CODE:
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], 0)
            else:
                self.assertEqual(response_body['managedFlag'], 0)
                self.assertEqual(response_body['exclusionFlag'], 0)
                self.assertEqual(response_body['assessmentFlag'], -1)

    def test_execute_copy_item_setting_success_copy(self):
        self.create_data_test_api_execute_copy_item_setting()
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # get data source
        assessments = pm_assessmentItems.query_filter_account_refine_code(
            test_user_id, account_refine_code)
        assessments = sorted(assessments, key=itemgetter('CheckItemCode'))
        exclusions = pm_exclusionitems.query_filter_account_refine_code(
            test_user_id, account_refine_code)
        exclusions = sorted(exclusions, key=itemgetter('CheckItemCode'))
        # Call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data response
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)
        # get data copy
        assessments_copy = pm_assessmentItems.query_filter_account_refine_code(
            test_user_id, account_refine_code_copy)
        assessments_copy = sorted(
            assessments_copy, key=itemgetter('CheckItemCode'))
        exclusions_copy = pm_exclusionitems.query_filter_account_refine_code(
            test_user_id, account_refine_code_copy)
        exclusions_copy = sorted(
            exclusions_copy, key=itemgetter('CheckItemCode'))
        # check data
        self.assertEqual(len(assessments), len(assessments_copy))
        self.assertEqual(len(exclusions), len(exclusions_copy))
        for i in range(len(exclusions)):
            test_check_item_code = exclusions[i]['CheckItemCode']
            test_exclusion_item_id_copy = CommonConst.EXCLUSIONITEM_ID.format(
                organization_id_copy, project_id_copy, aws_account_copy,
                test_check_item_code)
            self.assertEqual(exclusions_copy[i]['AccountRefineCode'],
                             account_refine_code_copy)
            self.assertEqual(exclusions_copy[i]['ExclusionItemID'],
                             test_exclusion_item_id_copy)
            self.assertEqual(exclusions_copy[i]['OrganizationID'],
                             organization_id_copy)
            self.assertEqual(exclusions_copy[i]['ProjectID'], project_id_copy)
            self.assertEqual(exclusions_copy[i]['AWSAccount'],
                             aws_account_copy)
            self.assertEqual(exclusions_copy[i]['CheckItemCode'],
                             test_check_item_code)
            self.assertEqual(exclusions_copy[i]['ExclusionComment'],
                             exclusions[i]['ExclusionComment'])

        for i in range(len(assessments)):
            test_check_item_code = assessments[i]['CheckItemCode']
            test_assessment_item_id_copy = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id_copy, project_id_copy, aws_account_copy,
                test_check_item_code)
            self.assertEqual(assessments_copy[i]['AccountRefineCode'],
                             account_refine_code_copy)
            self.assertEqual(assessments_copy[i]['AssessmentItemID'],
                             test_assessment_item_id_copy)
            self.assertEqual(assessments_copy[i]['OrganizationID'],
                             organization_id_copy)
            self.assertEqual(assessments_copy[i]['ProjectID'], project_id_copy)
            self.assertEqual(assessments_copy[i]['AWSAccount'],
                             aws_account_copy)
            self.assertEqual(assessments_copy[i]['CheckItemCode'],
                             test_check_item_code)
            self.assertEqual(assessments_copy[i]['AssessmentComment'],
                             assessments[i]['AssessmentComment'])

    def test_execute_copy_item_setting_success_update(self):
        self.create_data_test_api_execute_copy_item_setting()
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_update,
            "project_id": project_id_update,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # get data source
        assessment = pm_assessmentItems.query_key(test_user_id,
                                                  assessment_item_id)
        exclusion = pm_exclusionitems.query_key(test_user_id,
                                                exclusion_item_id)
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data response
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)
        # get data copy
        assessment_update = pm_assessmentItems.query_key(
            test_user_id, assessment_item_id_update)
        exclusion_update = pm_exclusionitems.query_key(
            test_user_id, exclusion_item_id_update)
        # check data
        self.assertEqual(exclusion_update['AccountRefineCode'],
                         account_refine_code_update)
        self.assertEqual(exclusion_update['ExclusionItemID'],
                         exclusion_item_id_update)
        self.assertEqual(exclusion_update['OrganizationID'],
                         organization_id_update)
        self.assertEqual(exclusion_update['ProjectID'], project_id_update)
        self.assertEqual(exclusion_update['AWSAccount'], aws_account_copy)
        self.assertEqual(exclusion_update['CheckItemCode'],
                         exclusion['CheckItemCode'])
        self.assertEqual(exclusion_update['ExclusionComment'],
                         exclusion['ExclusionComment'])
        # check data assessment
        self.assertEqual(assessment_update['AccountRefineCode'],
                         account_refine_code_update)
        self.assertEqual(assessment_update['AssessmentItemID'],
                         assessment_item_id_update)
        self.assertEqual(assessment_update['OrganizationID'],
                         organization_id_update)
        self.assertEqual(assessment_update['ProjectID'], project_id_update)
        self.assertEqual(assessment_update['AWSAccount'], aws_account_copy)
        self.assertEqual(assessment_update['CheckItemCode'],
                         assessment['CheckItemCode'])
        self.assertEqual(assessment_update['AssessmentComment'],
                         assessment['AssessmentComment'])

    def test_execute_copy_item_setting_success_exclusion_items_source_zero_record(self):
        self.create_data_test_api_execute_copy_item_setting()
        attribute = {'AccountRefineCode': {"Value": "not_exists"}}
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        for check_item_code in LIST_CHECK_ITEM_CODE_COPY:
            test_exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code)
            pm_exclusionitems.update(trace_id, test_exclusion_item_id, attribute)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # get data source
        assessments = pm_assessmentItems.query_filter_account_refine_code(
            test_user_id, account_refine_code)
        assessments = sorted(assessments, key=itemgetter('CheckItemCode'))
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data response
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)
        # get data copy
        assessments_copy = pm_assessmentItems.query_filter_account_refine_code(
            test_user_id, account_refine_code_copy)
        assessments_copy = sorted(
            assessments_copy, key=itemgetter('CheckItemCode'))
        exclusions_copy = pm_exclusionitems.query_filter_account_refine_code(
            test_user_id, account_refine_code_copy)
        # check data
        self.assertEqual(len(assessments), len(assessments_copy))
        self.assertEqual(len(exclusions_copy), 0)
        for i in range(len(assessments)):
            test_check_item_code = assessments[i]['CheckItemCode']
            test_assessment_item_id_copy = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id_copy, project_id_copy, aws_account_copy,
                test_check_item_code)
            self.assertEqual(assessments_copy[i]['AccountRefineCode'],
                             account_refine_code_copy)
            self.assertEqual(assessments_copy[i]['AssessmentItemID'],
                             test_assessment_item_id_copy)
            self.assertEqual(assessments_copy[i]['OrganizationID'],
                             organization_id_copy)
            self.assertEqual(assessments_copy[i]['ProjectID'],
                             project_id_copy)
            self.assertEqual(assessments_copy[i]['AWSAccount'],
                             aws_account_copy)
            self.assertEqual(assessments_copy[i]['CheckItemCode'],
                             test_check_item_code)
            self.assertEqual(assessments_copy[i]['AssessmentComment'],
                             assessments[i]['AssessmentComment'])

    def test_execute_copy_item_setting_success_assessment_items_source_zero_record(self):
        self.create_data_test_api_execute_copy_item_setting()
        attribute = {'AccountRefineCode': {"Value": "not_exists"}}
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        for check_item_code in LIST_CHECK_ITEM_CODE_COPY:
            test_assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code)
            pm_assessmentItems.update(trace_id, test_assessment_item_id,
                                      attribute)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # get data source
        exclusions = pm_exclusionitems.query_filter_account_refine_code(
            test_user_id, account_refine_code)
        exclusions = sorted(exclusions, key=itemgetter('CheckItemCode'))
        # Call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data response
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)
        # Get data copy
        assessments_copy = pm_assessmentItems.query_filter_account_refine_code(
            test_user_id, account_refine_code_copy)
        exclusions_copy = pm_exclusionitems.query_filter_account_refine_code(
            test_user_id, account_refine_code_copy)
        exclusions_copy = sorted(
            exclusions_copy, key=itemgetter('CheckItemCode'))
        # check data
        self.assertEqual(len(assessments_copy), 0)
        self.assertEqual(len(exclusions), len(exclusions_copy))
        for i in range(len(exclusions)):
            test_check_item_code = exclusions[i]['CheckItemCode']
            test_exclusion_item_id_copy = CommonConst.EXCLUSIONITEM_ID.format(
                organization_id_copy, project_id_copy, aws_account_copy,
                test_check_item_code)
            self.assertEqual(exclusions_copy[i]['AccountRefineCode'],
                             account_refine_code_copy)
            self.assertEqual(exclusions_copy[i]['ExclusionItemID'],
                             test_exclusion_item_id_copy)
            self.assertEqual(exclusions_copy[i]['OrganizationID'],
                             organization_id_copy)
            self.assertEqual(exclusions_copy[i]['ProjectID'],
                             project_id_copy)
            self.assertEqual(exclusions_copy[i]['AWSAccount'],
                             aws_account_copy)
            self.assertEqual(exclusions_copy[i]['CheckItemCode'],
                             test_check_item_code)
            self.assertEqual(exclusions_copy[i]['ExclusionComment'],
                             exclusions[i]['ExclusionComment'])

    def test_execute_copy_item_setting_error_access_authority_source(self):
        self.create_data_test_api_execute_copy_item_setting()
        attribute = {'Authority': {"Value": 1}}
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        pm_affiliation.update_affiliation(
            trace_id, test_user_id, organization_id, attribute, None)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.FORBIDDEN)

    def test_execute_copy_item_setting_error_access_authority_copy(self):
        self.create_data_test_api_execute_copy_item_setting()
        attribute = {'Authority': {"Value": 1}}
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        pm_affiliation.update_affiliation(
            trace_id, test_user_id, organization_id_copy, attribute, None)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.FORBIDDEN)

    def test_execute_copy_item_setting_error_aws_acount_source_zero_record(self):
        self.create_data_test_api_execute_copy_item_setting()
        test_coop_id = common_utils.get_uuid4()
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": test_coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_execute_copy_item_setting_error_aws_acount_copy_zero_record(self):
        self.create_data_test_api_execute_copy_item_setting()
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        test_coop_id = common_utils.get_uuid4()
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": test_coop_id,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data
        message_401 = MsgConst.ERR_AWS_401
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_401['code'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_execute_copy_item_setting_error_exclusion_and_assessment_zero_record(self):
        self.create_data_test_api_execute_copy_item_setting()
        attribute = {'AccountRefineCode': {"Value": "not_exists"}}
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        for check_item_code in LIST_CHECK_ITEM_CODE_COPY:
            test_assessment_item_id = CommonConst.ASSESSMENTITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code)
            pm_assessmentItems.update(trace_id, test_assessment_item_id,
                                      attribute)
            test_exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
                organization_id, project_id, aws_account, check_item_code)
            pm_exclusionitems.update(trace_id, test_exclusion_item_id, attribute)
        param_source_body = {
            "copy_source": {
                "organization_id": organization_id,
                "project_id": project_id,
                "coop_id": coop_id
            }
        }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        message_301 = MsgConst.ERR_301
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_301['code'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.NOT_FOUND)

    def test_execute_copy_item_setting_error_by_parser_data_body_error(self):
        test_user_id = user_id.format(2)
        test_mail_address = mail_address.format(2)
        param_source_body = {
                  "other": "string"
                }
        path_parameters = {
            "organization_id": organization_id_copy,
            "project_id": project_id_copy,
            "coop_id": coop_id_copy,
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(param_source_body),
            email=test_mail_address)
        # call API
        response = checkitemsettings.execute_copy_item_setting_handler(
            event_mock, {})
        # check data
        message_202 = MsgConst.ERR_REQUEST_202
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_202['code'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.BAD_REQUEST)
