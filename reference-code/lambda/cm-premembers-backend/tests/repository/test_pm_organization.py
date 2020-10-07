import unittest
from premembers.repository import pm_organizations, pm_affiliation
from premembers.exception.pm_exceptions import NoRetryException
from dotenv import load_dotenv
from pathlib import Path
from pytz import timezone
import os
from datetime import datetime

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
now = datetime.now()
trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
batch_affiliation_address = "test-user-batch@sample.com"
batch_affiliation_user_id = "test-user-batch"
batch_organization_id = "e3098ac4-78fd-11e7-a0c0-c3aee17e6adf"
batch_affiliation_authority = 3
batch_affiliation_invitation_status = 0
batch_affiliation = {
    "MailAddress": batch_affiliation_address,
    "UserID": batch_affiliation_user_id,
    "Authority": batch_affiliation_authority,
    "OrganizationID": batch_organization_id,
    "InvitationStatus": batch_affiliation_invitation_status,
    "CreatedAt": str(timezone('UTC').localize(now)),
    "UpdatedAt": str(timezone('UTC').localize(now))
}
batch_organization = {
    'OrganizationID': batch_organization_id,
    'OrganizationName': "batch organization Div.",
    'Contract': "0",
    'ContractStatus': "0",
    "CreatedAt": str(timezone('UTC').localize(now)),
    "UpdatedAt": str(timezone('UTC').localize(now))
}
test_organization_id = "b55e82e4-77f1-11e7-adfe-df33b64daf62"
test_organization = {
    'OrganizationID': test_organization_id,
    'OrganizationName': "insert organization Div.",
    'Contract': "0",
    'ContractStatus': "0"
}
insert_organization_id = "fd6d127a-7757-11e7-af6b-5b7a5f78f1c8"
insert_organization = {
    'OrganizationID': insert_organization_id,
    'OrganizationName': "insert organization Div.",
    'Contract': "0",
    'ContractStatus': "0"
}
delete_organization_id = "72f3d306-77f0-11e7-8ac9-4390009e7c3b"
delete_organization = {
    'OrganizationID': delete_organization_id,
    'OrganizationName': "delete organization Div.",
    'Contract': "0",
    'ContractStatus': "0"
}
update_organization_id = "f7fa46c0-77f0-11e7-97e2-3b313df1468f"
update_organization = {
    'OrganizationID': update_organization_id,
    'OrganizationName': "empty Div.",
    'Contract': "0",
    'ContractStatus': "0"
}


class TestOraganizations(unittest.TestCase):
    def organization_result_check(self, actual_organization,
                                  expected_organization):
        self.assertEqual(actual_organization['OrganizationID'],
                         expected_organization['OrganizationID'])
        self.assertEqual(actual_organization['OrganizationName'],
                         expected_organization['OrganizationName'])
        self.assertEqual(actual_organization['Contract'],
                         expected_organization['Contract'])
        self.assertEqual(actual_organization['ContractStatus'],
                         expected_organization['ContractStatus'])

    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)
        pm_organizations.create_organization(
            trace_id, test_organization['OrganizationID'],
            test_organization['OrganizationName'],
            test_organization['Contract'], test_organization['ContractStatus'])
        pm_organizations.create_organization(
            trace_id, delete_organization['OrganizationID'],
            delete_organization['OrganizationName'],
            delete_organization['Contract'],
            delete_organization['ContractStatus'])
        pm_organizations.create_organization(
            trace_id, update_organization['OrganizationID'],
            update_organization['OrganizationName'],
            update_organization['Contract'],
            update_organization['ContractStatus'])

    def tearDown(self):
        pm_organizations.delete_organization(trace_id, test_organization_id)
        pm_organizations.delete_organization(trace_id, insert_organization_id)
        pm_organizations.delete_organization(trace_id, update_organization_id)
        pm_organizations.delete_organization(trace_id, delete_organization_id)
        pm_organizations.delete_organization(trace_id, batch_organization_id)
        pm_affiliation.delete_affiliation(batch_affiliation_user_id,
                                          batch_organization_id)

    def test_テーブルへのアイテム追加(self):
        pm_organizations.create_organization(
            trace_id, insert_organization['OrganizationID'],
            insert_organization['OrganizationName'],
            insert_organization['Contract'],
            insert_organization['ContractStatus'])
        insert_result = pm_organizations.get_organization(
            trace_id, insert_organization_id)
        self.organization_result_check(
            actual_organization=insert_result,
            expected_organization=insert_organization)

    def test_テーブルへのアイテム追加_重複エラー(self):
        pm_organizations.create_organization(
            trace_id, insert_organization['OrganizationID'],
            insert_organization['OrganizationName'],
            insert_organization['Contract'],
            insert_organization['ContractStatus'])
        with self.assertRaises(NoRetryException):
            pm_organizations.create_organization(
                trace_id, insert_organization['OrganizationID'],
                insert_organization['OrganizationName'],
                insert_organization['Contract'],
                insert_organization['ContractStatus'])

    def test_テーブルへのアイテム取得(self):
        get_result = pm_organizations.get_organization(trace_id,
                                                       test_organization_id)
        self.organization_result_check(
            actual_organization=get_result,
            expected_organization=test_organization)

    def test_テーブルへのアイテム更新(self):
        update_target_result = pm_organizations.get_organization(
            trace_id, update_organization_id)
        update_target_update_time = update_target_result['UpdatedAt']
        update_organization_name = "Premembers update Div."
        update_contract = '5'
        update_contract_status = '5'
        attribute = {
            'OrganizationName': {
                "Value": update_organization_name
            },
            'Contract': {
                "Value": update_contract
            },
            'ContractStatus': {
                "Value": update_contract_status
            }
        }
        pm_organizations.update_organization(
            trace_id,
            organization_id=update_organization_id,
            update_attribute=attribute,
            target_update_date=update_target_update_time)
        update_result = pm_organizations.get_organization(
            trace_id, organization_id=update_organization_id)
        self.assertNotEqual(update_result['OrganizationName'],
                            update_organization['OrganizationName'])
        self.assertEqual(update_result['OrganizationName'],
                         update_organization_name)
        self.assertNotEqual(update_result['Contract'],
                            update_organization['Contract'])
        self.assertEqual(update_result['Contract'], update_contract)
        self.assertNotEqual(update_result['ContractStatus'],
                            update_organization['ContractStatus'])
        self.assertEqual(update_result['ContractStatus'],
                         update_contract_status)

    def test_テーブルへのアイテム更新_updateAt不一致(self):
        update_target_result = pm_organizations.get_organization(
            trace_id, update_organization_id)
        attribute = {}
        update_target_update_time = update_target_result['UpdatedAt']
        pm_organizations.update_organization(
            trace_id,
            organization_id=update_organization_id,
            update_attribute=attribute,
            target_update_date=update_target_update_time)
        update_organization_name = "Premembers update Div."
        update_contract = 5
        update_contract_status = 5
        attribute = {
            'OrganizationName': {
                "Value": update_organization_name
            },
            'Contract': {
                "Value": update_contract
            },
            'ContractStatus': {
                "Value": update_contract_status
            }
        }
        with self.assertRaises(NoRetryException):
            pm_organizations.update_organization(
                trace_id,
                organization_id=update_organization_id,
                update_attribute=attribute,
                target_update_date=update_target_update_time)

    def test_テーブルへのアイテム削除(self):
        pm_organizations.delete_organization(trace_id, delete_organization_id)
        delete_result = pm_organizations.delete_organization(
            trace_id, delete_organization_id)
        self.assertIsNone(delete_result)
