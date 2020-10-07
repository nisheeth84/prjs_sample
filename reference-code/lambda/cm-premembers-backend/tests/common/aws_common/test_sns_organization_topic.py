import os
import json

from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from premembers.common import aws_common
from premembers.const.const import CommonConst
from tests.mock.data.aws.data_common import DataCommon
from tests.mock.data.aws.sns.data_test_sns import DataTestSns

user_id = DataCommon.USER_ID_TEST.format(str(3))
organization_id = DataCommon.ORGANIZATION_ID_TEST.format(str(3))
task_id = DataTestSns.TASK_ID
subject = DataTestSns.SUBJECT
topic_arn_test = os.environ.get("SNS_ORGANIZATION_TOPIC")


class TestSnsOrganizationTopic(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_sns_organization_topic_success_case_exists_organization_id_and_user_id(self):
        expected_message = DataTestSns.MESSAGE

        # mock object
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")

        # start mock object
        mock_aws_sns = patch_aws_sns.start()

        # mock data
        mock_aws_sns.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_aws_sns.stop)

        # call Function test
        aws_common.sns_organization_topic(
            user_id, task_id, CommonConst.TASK_TYPE_CODE_DELETE_ORG,
            organization_id, user_id)

        # check param call fuction aws_sns
        mock_aws_sns.assert_called_once_with(user_id, subject,
                                             json.dumps(expected_message),
                                             topic_arn_test)

    def test_sns_organization_topic_success_case_not_exists_organization_id_and_user_id(self):
        expected_message = DataTestSns.MESSAGE_NOT_EXISTS_ORGANIZATION_ID_AND_USER_ID

        # mock object
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")

        # start mock object
        mock_aws_sns = patch_aws_sns.start()

        # mock data
        mock_aws_sns.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_aws_sns.stop)

        # call Function test
        aws_common.sns_organization_topic(
            user_id, task_id, CommonConst.TASK_TYPE_CODE_DELETE_ORG)

        # check param call fuction aws_sns
        mock_aws_sns.assert_called_once_with(user_id, subject,
                                             json.dumps(expected_message),
                                             topic_arn_test)
