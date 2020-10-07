import unittest
from premembers.repository import pm_affiliation
from dotenv import load_dotenv
from pathlib import Path
from boto3.dynamodb.conditions import Attr
import os
import copy
import uuid

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
affiliation_template_address = "test-user{}@sample.com"
affiliation_template_user_id = "test-user{}"
affiliation_template_organization_id = "3388259c-7821-11e7-9fb6-bb2200a6cdd"
affiliation_template_organization_id_template = "eeb367aa-78ee-11e7-89e6-8ffd9d626c2{}"
affiliation_template_authority = 3
affiliation_template_authority = 0
affiliation_template_invitation_status = 0
affiliation_template = {
    "MailAddress": affiliation_template_address,
    "UserID": affiliation_template_user_id,
    "Authority": affiliation_template_authority,
    "OrganizationID": affiliation_template_organization_id,
    "InvitationStatus": affiliation_template_invitation_status,
}


class TestAffiliation(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)
        num = 0
        while num < 10:
            tmp_affiliation = copy.copy(affiliation_template)
            tmp_affiliation['MailAddress'] = affiliation_template[
                'MailAddress'].format(str(num))
            tmp_affiliation['UserID'] = affiliation_template['UserID'].format(
                str(num))
            tmp_affiliation['InvitationStatus'] = num % 3 - 1
            pm_affiliation.create_affiliation(
                trace_id, tmp_affiliation['MailAddress'],
                tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
                tmp_affiliation['Authority'],
                tmp_affiliation['InvitationStatus'])
            num += 1

        num = 0
        while num < 10:
            organization_id = affiliation_template_organization_id_template.format(
                str(num))
            tmp_affiliation = copy.copy(affiliation_template)
            tmp_affiliation['MailAddress'] = affiliation_template[
                'MailAddress'].format(str(20))
            tmp_affiliation['UserID'] = affiliation_template['UserID'].format(
                str(20))
            tmp_affiliation['OrganizationID'] = organization_id
            tmp_affiliation['InvitationStatus'] = num % 3 - 1
            pm_affiliation.create_affiliation(
                trace_id, tmp_affiliation['MailAddress'],
                tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
                tmp_affiliation['Authority'],
                tmp_affiliation['InvitationStatus'])
            num += 1

    def tearDown(self):
        num = 0
        while num < 10:
            delete_user_id = affiliation_template['UserID'].format(str(num))
            pm_affiliation.delete_affiliation(
                user_id=delete_user_id,
                organization_id=affiliation_template_organization_id)
            num += 1

        num = 0
        while num < 10:
            delete_organization_id = affiliation_template_organization_id_template.format(
                str(num))
            delete_user_id = affiliation_template['UserID'].format(str(20))
            pm_affiliation.delete_affiliation(
                user_id=delete_user_id, organization_id=delete_organization_id)
            num += 1

    def test_アイテム取得_条件一致(self):
        user_id = affiliation_template_user_id.format(str(1))
        organization_id = affiliation_template_organization_id.format(str(1))
        affiliation = pm_affiliation.get_affiliation(
            user_id=user_id, organization_id=organization_id)
        self.assertEqual(affiliation['UserID'], user_id)
        self.assertEqual(affiliation['OrganizationID'], organization_id)

    def test_queryを用いての取得_条件一致(self):
        user_id = affiliation_template_user_id.format(str(1))
        organization_id = affiliation_template_organization_id.format(str(1))
        result = pm_affiliation.query(
            user_id=user_id, organization_id=organization_id)
        affiliation = result[0]
        self.assertEqual(affiliation['UserID'], user_id)
        self.assertEqual(affiliation['OrganizationID'], organization_id)

    def test_queryを用いての取得_抽出条件不一致(self):
        user_id = affiliation_template_user_id.format(str(2))
        randam_uuid = "2584c73c-7918-11e7-8fb6-db7e72bc4bc1"
        organization_id = randam_uuid
        result = pm_affiliation.query(
            user_id=user_id, organization_id=organization_id)
        self.assertEqual(len(result), 0)

    def test_queryを用いての取得_filter条件不一致(self):
        user_id = affiliation_template_user_id.format(str(1))
        organization_id = affiliation_template_organization_id
        filter = Attr('InvitationStatus').eq(1)
        result = pm_affiliation.query(
            user_id=user_id,
            organization_id=organization_id,
            filter_expression=filter)
        self.assertEqual(len(result), 0)

    def test_GSIを用いてのquery(self):
        organization_id = affiliation_template_organization_id
        result = pm_affiliation.query_organization_index(
            trace_id, organization_id=organization_id)
        self.assertEqual(len(result), 10)

    def test_GSIを用いてのquery_filter利用(self):
        organization_id = affiliation_template_organization_id
        filter = Attr('InvitationStatus').eq(1)
        result = pm_affiliation.query_organization_index(
            trace_id,
            organization_id=organization_id,
            filter_expression=filter)
        self.assertEqual(len(result), 3)

    def test_GSIを用いてのquery_count(self):
        trace_id = str(uuid.uuid4())
        user_id = affiliation_template_user_id.format(str(20))
        result = pm_affiliation.query_userid_key_count(
            trace_id=trace_id, user_id=user_id)
        self.assertEqual(result, 10)

    def test_GSIを用いてのquery_filter_count(self):
        trace_id = str(uuid.uuid4())
        user_id = affiliation_template_user_id.format(str(20))
        invite_status = 1
        result = pm_affiliation.query_userid_key_invite_count(
            trace_id=trace_id,
            user_id=user_id,
            invite_status=invite_status)
        self.assertEqual(result, 3)
