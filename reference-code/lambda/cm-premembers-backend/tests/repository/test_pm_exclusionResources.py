import copy

from tests.testcasebase import TestCaseBase
from tests.mock.aws.dynamodb import db_utils
from moto import mock_dynamodb2
from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.repository import pm_exclusionResources

data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
data_exclusion_resources_not_delete = copy.deepcopy(
    DataPmExclusionResources.EXCLUSION_RESOURCES_NOT_DELETE)
data_pm_exclusion_resources_check_item_code_asc = copy.deepcopy(
    DataPmExclusionResources.DATA_EXCLUSION_RESOURCE_CHECK_ITEM_CODE_CIS)
account_refine_code = copy.deepcopy(DataPmExclusionResources.ACCOUNT_REFINE_CODE)


@mock_dynamodb2
class TestPmExclusionResources(TestCaseBase):
    def setUp(self):
        # parent setUp()
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)

        # create pm_exclusionResources table
        mock_pm_exclusionResources.create_table()

    def test_query_key(self):
        # prepare data
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # call function test
        result = pm_exclusionResources.query_key(
            trace_id, data_pm_exclusion_resources['ExclusionResourceID'])

        # check data
        self.assertEqual(data_pm_exclusion_resources['ExclusionResourceID'],
                         result['ExclusionResourceID'])
        self.assertEqual(data_pm_exclusion_resources['AWSAccount'],
                         result['AWSAccount'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemCode'],
                         result['CheckItemCode'])
        self.assertEqual(data_pm_exclusion_resources['RegionName'],
                         result['RegionName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceName'],
                         result['ResourceName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceType'],
                         result['ResourceType'])
        self.assertEqual(data_pm_exclusion_resources['ExclusionComment'],
                         result['ExclusionComment'])
        self.assertEqual(data_pm_exclusion_resources['UserID'],
                         result['UserID'])
        self.assertEqual(data_pm_exclusion_resources['MailAddress'],
                         result['MailAddress'])
        self.assertEqual(data_pm_exclusion_resources['AccountRefineCode'],
                         result['AccountRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemRefineCode'],
                         result['CheckItemRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['OrganizationID'],
                         result['OrganizationID'])
        self.assertEqual(data_pm_exclusion_resources['ProjectID'],
                         result['ProjectID'])
        self.assertEqual(data_pm_exclusion_resources['TimeToLive'],
                         result['TimeToLive'])
        self.assertEqual(data_pm_exclusion_resources['CreatedAt'],
                         result['CreatedAt'])
        self.assertEqual(data_pm_exclusion_resources['UpdatedAt'],
                         result['UpdatedAt'])

    def test_query_key_convert_response(self):
        # prepare data
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # call function test
        result = pm_exclusionResources.query_key(
            trace_id,
            data_pm_exclusion_resources['ExclusionResourceID'],
            convert_response=True)

        # check data
        self.assertEqual(data_pm_exclusion_resources['ExclusionResourceID'],
                         result['id'])
        self.assertEqual(data_pm_exclusion_resources['AWSAccount'],
                         result['awsAccount'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemCode'],
                         result['checkItemCode'])
        self.assertEqual(data_pm_exclusion_resources['RegionName'],
                         result['regionName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceName'],
                         result['resourceName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceType'],
                         result['resourceType'])
        self.assertEqual(data_pm_exclusion_resources['ExclusionComment'],
                         result['exclusionComment'])
        self.assertEqual(data_pm_exclusion_resources['OrganizationID'],
                         result['organizationId'])
        self.assertEqual(data_pm_exclusion_resources['ProjectID'],
                         result['projectId'])
        self.assertEqual(data_pm_exclusion_resources['MailAddress'],
                         result['mailAddress'])
        self.assertEqual(data_pm_exclusion_resources['CreatedAt'],
                         result['createdAt'])
        self.assertEqual(data_pm_exclusion_resources['UpdatedAt'],
                         result['updatedAt'])

    def test_create(self):
        # call function test
        pm_exclusionResources.create(
            data_pm_exclusion_resources['UserID'],
            data_pm_exclusion_resources['ExclusionResourceID'],
            data_pm_exclusion_resources['OrganizationID'],
            data_pm_exclusion_resources['ProjectID'],
            data_pm_exclusion_resources['AWSAccount'],
            data_pm_exclusion_resources['CheckItemCode'],
            data_pm_exclusion_resources['RegionName'],
            data_pm_exclusion_resources['ResourceType'],
            data_pm_exclusion_resources['ResourceName'],
            data_pm_exclusion_resources['ExclusionComment'],
            data_pm_exclusion_resources['MailAddress'],
            data_pm_exclusion_resources['AccountRefineCode'],
            data_pm_exclusion_resources['CheckItemRefineCode'],
            data_pm_exclusion_resources['TimeToLive'])

        # get data
        result = mock_pm_exclusionResources.query_key(
            data_pm_exclusion_resources['ExclusionResourceID'])

        # check data
        self.assertEqual(data_pm_exclusion_resources['ExclusionResourceID'],
                         result['ExclusionResourceID'])
        self.assertEqual(data_pm_exclusion_resources['AWSAccount'],
                         result['AWSAccount'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemCode'],
                         result['CheckItemCode'])
        self.assertEqual(data_pm_exclusion_resources['RegionName'],
                         result['RegionName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceType'],
                         result['ResourceType'])
        self.assertEqual(data_pm_exclusion_resources['ResourceName'],
                         result['ResourceName'])
        self.assertEqual(data_pm_exclusion_resources['ExclusionComment'],
                         result['ExclusionComment'])
        self.assertEqual(data_pm_exclusion_resources['UserID'],
                         result['UserID'])
        self.assertEqual(data_pm_exclusion_resources['MailAddress'],
                         result['MailAddress'])
        self.assertEqual(data_pm_exclusion_resources['AccountRefineCode'],
                         result['AccountRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemRefineCode'],
                         result['CheckItemRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['OrganizationID'],
                         result['OrganizationID'])
        self.assertEqual(data_pm_exclusion_resources['ProjectID'],
                         result['ProjectID'])
        self.assertEqual(data_pm_exclusion_resources['TimeToLive'],
                         result['TimeToLive'])

    def test_update(self):
        # prepare data
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)
        exclusion_comment_update = copy.deepcopy(
            DataPmExclusionResources.EXCLUSION_COMMENT_UPDATE)
        attribute = {'ExclusionComment': {"Value": exclusion_comment_update}}

        # call function test
        pm_exclusionResources.update(
            trace_id, data_pm_exclusion_resources["ExclusionResourceID"],
            attribute)

        # Get data
        result = mock_pm_exclusionResources.query_key(
            data_pm_exclusion_resources["ExclusionResourceID"])

        # check data
        self.assertEqual(data_pm_exclusion_resources['ExclusionResourceID'],
                         result['ExclusionResourceID'])
        self.assertEqual(data_pm_exclusion_resources['AWSAccount'],
                         result['AWSAccount'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemCode'],
                         result['CheckItemCode'])
        self.assertEqual(data_pm_exclusion_resources['RegionName'],
                         result['RegionName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceType'],
                         result['ResourceType'])
        self.assertEqual(data_pm_exclusion_resources['ResourceName'],
                         result['ResourceName'])
        self.assertEqual(exclusion_comment_update, result['ExclusionComment'])
        self.assertEqual(data_pm_exclusion_resources['UserID'],
                         result['UserID'])
        self.assertEqual(data_pm_exclusion_resources['MailAddress'],
                         result['MailAddress'])
        self.assertEqual(data_pm_exclusion_resources['AccountRefineCode'],
                         result['AccountRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemRefineCode'],
                         result['CheckItemRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['OrganizationID'],
                         result['OrganizationID'])
        self.assertEqual(data_pm_exclusion_resources['ProjectID'],
                         result['ProjectID'])
        self.assertEqual(data_pm_exclusion_resources['TimeToLive'],
                         result['TimeToLive'])
        self.assertEqual(data_pm_exclusion_resources['CreatedAt'],
                         result['CreatedAt'])

    def test_query_filter_region_name_and_resource_name_success(self):
        # perpare data test
        # create record query
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # call function test
        actual_exclusion_resources_query = pm_exclusionResources.query_filter_region_name_and_resource_name(
            trace_id, data_pm_exclusion_resources['CheckItemRefineCode'],
            data_pm_exclusion_resources['RegionName'],
            data_pm_exclusion_resources['ResourceType'],
            data_pm_exclusion_resources['ResourceName'])

        # Check data
        self.assertDictEqual(data_pm_exclusion_resources,
                             actual_exclusion_resources_query[0])

    def test_delete_success(self):
        # perpare data test
        # create record delete
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # create record not delete
        mock_pm_exclusionResources.create(data_exclusion_resources_not_delete)

        # call function test
        pm_exclusionResources.delete(trace_id, data_pm_exclusion_resources['ExclusionResourceID'])

        # get record pm_exclusionResources delete
        actual_exclusion_resources_delete = mock_pm_exclusionResources.query_key(
            data_pm_exclusion_resources['ExclusionResourceID'])

        # get record pm_exclusionResources not delete
        actual_exclusion_resources_not_delete = mock_pm_exclusionResources.query_key(
            data_exclusion_resources_not_delete['ExclusionResourceID'])

        # Check data
        self.assertEqual(None, actual_exclusion_resources_delete)
        self.assertDictEqual(data_exclusion_resources_not_delete,
                             actual_exclusion_resources_not_delete)

    def test_query_check_item_refine_code_success(self):
        # perpare data test
        # create record query
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # call function test
        actual_exclusion_resources_query = pm_exclusionResources.query_check_item_refine_code(
            trace_id, data_pm_exclusion_resources['CheckItemRefineCode'])

        # Check data
        self.assertDictEqual(data_pm_exclusion_resources,
                             actual_exclusion_resources_query[0])

    def test_query_check_item_refine_code_convert_response_success(self):
        # perpare data test
        # create record query
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # call function test
        actual_exclusion_resources_query = pm_exclusionResources.query_check_item_refine_code(
            trace_id, data_pm_exclusion_resources['CheckItemRefineCode'], None, True)

        # Check data
        self.assertEqual(data_pm_exclusion_resources['ExclusionResourceID'], actual_exclusion_resources_query[0]['id'])
        self.assertEqual(data_pm_exclusion_resources['OrganizationID'], actual_exclusion_resources_query[0]['organizationId'])
        self.assertEqual(data_pm_exclusion_resources['ProjectID'], actual_exclusion_resources_query[0]['projectId'])
        self.assertEqual(data_pm_exclusion_resources['AWSAccount'], actual_exclusion_resources_query[0]['awsAccount'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemCode'], actual_exclusion_resources_query[0]['checkItemCode'])
        self.assertEqual(data_pm_exclusion_resources['RegionName'], actual_exclusion_resources_query[0]['regionName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceName'], actual_exclusion_resources_query[0]['resourceName'])
        self.assertEqual(data_pm_exclusion_resources['ExclusionComment'], actual_exclusion_resources_query[0]['exclusionComment'])
        self.assertEqual(data_pm_exclusion_resources['MailAddress'], actual_exclusion_resources_query[0]['mailAddress'])
        self.assertEqual(data_pm_exclusion_resources['CreatedAt'], actual_exclusion_resources_query[0]['createdAt'])
        self.assertEqual(data_pm_exclusion_resources['UpdatedAt'], actual_exclusion_resources_query[0]['updatedAt'])

    def test_query_filter_account_refine_code(self):
        # prepare data
        group_filter = copy.deepcopy(DataPmExclusionResources.GROUP_FILTER)
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)
        mock_pm_exclusionResources.create(
            data_pm_exclusion_resources_check_item_code_asc)

        # call function test
        result = pm_exclusionResources.query_filter_account_refine_code(
            trace_id, account_refine_code, group_filter)

        # check data
        self.assertEqual(1, len(result))
        result = result[0]
        self.assertEqual(data_pm_exclusion_resources['ExclusionResourceID'],
                         result['ExclusionResourceID'])
        self.assertEqual(data_pm_exclusion_resources['AWSAccount'],
                         result['AWSAccount'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemCode'],
                         result['CheckItemCode'])
        self.assertEqual(data_pm_exclusion_resources['RegionName'],
                         result['RegionName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceName'],
                         result['ResourceName'])
        self.assertEqual(data_pm_exclusion_resources['ExclusionComment'],
                         result['ExclusionComment'])
        self.assertEqual(data_pm_exclusion_resources['UserID'],
                         result['UserID'])
        self.assertEqual(data_pm_exclusion_resources['MailAddress'],
                         result['MailAddress'])
        self.assertEqual(data_pm_exclusion_resources['AccountRefineCode'],
                         result['AccountRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemRefineCode'],
                         result['CheckItemRefineCode'])
        self.assertEqual(data_pm_exclusion_resources['OrganizationID'],
                         result['OrganizationID'])
        self.assertEqual(data_pm_exclusion_resources['ProjectID'],
                         result['ProjectID'])
        self.assertEqual(data_pm_exclusion_resources['TimeToLive'],
                         result['TimeToLive'])
        self.assertEqual(data_pm_exclusion_resources['CreatedAt'],
                         result['CreatedAt'])
        self.assertEqual(data_pm_exclusion_resources['UpdatedAt'],
                         result['UpdatedAt'])

    def test_query_account_refine_index_not_convert_response_success(self):
        # perpare data test
        # create record query
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # call function test
        actual_exclusion_resources_query = pm_exclusionResources.query_account_refine_index(
            trace_id, data_pm_exclusion_resources['AccountRefineCode'])

        # Check data
        self.assertDictEqual(data_pm_exclusion_resources,
                             actual_exclusion_resources_query[0])

    def test_query_account_refine_index_convert_response_success(self):
        # perpare data test
        # create record query
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # call function test
        actual_exclusion_resources_query = pm_exclusionResources.query_account_refine_index(
            trace_id, data_pm_exclusion_resources['AccountRefineCode'], None,
            True)

        # Check data
        self.assertEqual(1, len(actual_exclusion_resources_query))
        self.assertEqual(data_pm_exclusion_resources['ExclusionResourceID'], actual_exclusion_resources_query[0]['id'])
        self.assertEqual(data_pm_exclusion_resources['OrganizationID'], actual_exclusion_resources_query[0]['organizationId'])
        self.assertEqual(data_pm_exclusion_resources['ProjectID'], actual_exclusion_resources_query[0]['projectId'])
        self.assertEqual(data_pm_exclusion_resources['AWSAccount'], actual_exclusion_resources_query[0]['awsAccount'])
        self.assertEqual(data_pm_exclusion_resources['CheckItemCode'], actual_exclusion_resources_query[0]['checkItemCode'])
        self.assertEqual(data_pm_exclusion_resources['RegionName'], actual_exclusion_resources_query[0]['regionName'])
        self.assertEqual(data_pm_exclusion_resources['ResourceType'], actual_exclusion_resources_query[0]['resourceType'])
        self.assertEqual(data_pm_exclusion_resources['ResourceName'], actual_exclusion_resources_query[0]['resourceName'])
        self.assertEqual(data_pm_exclusion_resources['ExclusionComment'], actual_exclusion_resources_query[0]['exclusionComment'])
        self.assertEqual(data_pm_exclusion_resources['MailAddress'], actual_exclusion_resources_query[0]['mailAddress'])
        self.assertEqual(data_pm_exclusion_resources['CreatedAt'], actual_exclusion_resources_query[0]['createdAt'])
        self.assertEqual(data_pm_exclusion_resources['UpdatedAt'], actual_exclusion_resources_query[0]['updatedAt'])
