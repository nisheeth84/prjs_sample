from premembers.common import checkaccess
import unittest
from dotenv import load_dotenv
from pathlib import Path
import os
import uuid

trace_id = str(uuid.uuid4())
account_id = 310725358451


class TestCheckAccess(unittest.TestCase):
    read_only_access = "PM-test_role_ReadOnlyAccess"
    admin_access = "PM-test_role_Administrator"
    read_only_and_s3 = "PM-test_role_ReadOnly_S3Full"
    no_role = "PM-test_role_NoRole"

    read_only_access_external_id = '983a7d46-9374-11e7-8e77-cb423c0ca91a'
    admin_access_external_id = 'f9dfb1d8-9374-11e7-bc27-538c85fe1cad'
    read_only_and_s3_external_id = '141af710-9375-11e7-8409-4b880ec51a0a'
    no_role_external_id = 'bd243b56-9374-11e7-a535-f3f4795c215d'

    def setUp(self):
        global execute_test
        global basic_role_policy
        global account_id
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

    def test_ReadOnlyAccessの権限を所有している(self):
        global account_id
        global execute_test
        global trace_id
        role_name = self.read_only_access
        external_id = self.read_only_access_external_id
        result = checkaccess.check_access_to_aws(trace_id, account_id,
                                                 role_name, external_id)
        self.assertTrue(result)

    def test_ReadOnlyAccessの権限を所有していない(self):
        global account_id
        global execute_test
        global trace_id
        role_name = self.no_role
        external_id = self.no_role_external_id
        result = checkaccess.check_access_to_aws(trace_id, account_id,
                                                 role_name, external_id)
        self.assertFalse(result)

    def test_AdministratorAccessの権限を所有している(self):
        global account_id
        global execute_test
        global trace_id
        role_name = self.admin_access
        external_id = self.admin_access_external_id
        result = checkaccess.check_access_to_aws(trace_id, account_id,
                                                 role_name, external_id,
                                                 ['AdministratorAccess'])
        self.assertTrue(result)

    def test_AdministratorAccessの権限を所有していない(self):
        global account_id
        global execute_test
        global trace_id
        role_name = self.read_only_access
        external_id = self.read_only_access_external_id
        result = checkaccess.check_access_to_aws(trace_id, account_id,
                                                 role_name, external_id,
                                                 ['AdministratorAccess'])
        self.assertFalse(result)

    def test_ReadOnlyAccessとAmazonS3FullAccessの権限を所有している(self):
        global account_id
        global execute_test
        global trace_id
        role_name = self.read_only_and_s3
        external_id = self.read_only_and_s3_external_id
        result = checkaccess.check_access_to_aws(
            trace_id, account_id, role_name, external_id,
            ['AmazonS3FullAccess', 'ReadOnlyAccess'])
        self.assertTrue(result)

    def test_ReadOnlyAccessとAmazonS3FullAccessのどちらかの権限を所有している(self):
        global account_id
        global execute_test
        global trace_id
        role_name = self.read_only_access
        external_id = self.read_only_access_external_id
        result = checkaccess.check_access_to_aws(
            trace_id, account_id, role_name, external_id,
            ['AmazonS3FullAccess', 'ReadOnlyAccess'])
        self.assertFalse(result)

    def test_ManagedPoliciesが付与されていない(self):
        global account_id
        global execute_test
        global trace_id
        role_name = self.no_role
        external_id = self.no_role_external_id
        result = checkaccess.check_access_to_aws(
            trace_id, account_id, role_name, external_id,
            ['AmazonS3FullAccess', 'ReadOnlyAccess'])
        self.assertFalse(result)
