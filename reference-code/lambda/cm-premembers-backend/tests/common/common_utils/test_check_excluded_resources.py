import copy
import unittest

from premembers.common import common_utils
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources

excluded_resources = copy.deepcopy(DataPmExclusionResources.DATA_EXCLUSION_RESOURCES)


class TestCheckExcludedResources(unittest.TestCase):
    def test_check_excluded_resources_is_true(self):
        # resource check
        check_item_code_matching = excluded_resources[0]['CheckItemCode']
        region_name_matching = excluded_resources[0]['RegionName']
        resource_type_matching = excluded_resources[0]['ResourceType']
        resource_name_matching = excluded_resources[0]['ResourceName']

        # call function test
        actual_result = common_utils.check_excluded_resources(
            check_item_code_matching, region_name_matching,
            resource_type_matching, resource_name_matching, excluded_resources)

        # check result
        self.assertEqual(True, actual_result)

    def test_check_excluded_resources_is_false(self):
        # resource check
        check_item_code_not_matching = excluded_resources[0]['CheckItemCode'] + "_Other"
        region_name_matching = excluded_resources[0]['RegionName']
        resource_type_matching = excluded_resources[0]['ResourceType']
        resource_name_matching = excluded_resources[0]['ResourceName']

        # call function test
        actual_result = common_utils.check_excluded_resources(
            check_item_code_not_matching, region_name_matching,
            resource_type_matching, resource_name_matching, excluded_resources)

        # check result
        self.assertEqual(False, actual_result)
