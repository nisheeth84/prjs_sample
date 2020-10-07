from premembers.repository import pm_affiliation
from premembers.common import checkauthority
from premembers.repository.const import Authority, InvitationStatus
import unittest
from dotenv import load_dotenv
from pathlib import Path
import os
import copy
import uuid

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
affiliation_template_address = "test-user{}@sample.com"
affiliation_template_user_id = "test-user{}"

affiliation_template_organization_id_template = "eeb367aa-78ee-11e7-89e6-8ffd9d626c2{}"
affiliation_template_invitation_status = 0
registered_affiliation_address = affiliation_template_address.format(
    "registered")
registered_organization_id = "3388259c-7821-11e7-9fb6-bb2200a6cdd"
not_enough_permission_affiliation_address = affiliation_template_address.format(
    "not_enough_permission")
not_belong_affiliation_address = affiliation_template_address.format(
    "not_belong")
not_belong_organization_id = "e288c67e-789f-4e3c-b158-c70140444288"

affiliation_template = {
    "MailAddress": affiliation_template_address,
    "UserID": affiliation_template_user_id,
    "InvitationStatus": affiliation_template_invitation_status,
}


class TestCheckAuthority(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)
        # 所属ユーザー(オーナー)の作成
        registered_affiliation = copy.copy(affiliation_template)
        registered_affiliation['MailAddress'] = registered_affiliation_address
        registered_affiliation['UserID'] = affiliation_template[
            'UserID'].format("registered")

        registered_affiliation['OrganizationID'] = registered_organization_id
        registered_affiliation[
            'InvitationStatus'] = InvitationStatus.Belong.value
        registered_affiliation['Authority'] = Authority.Owner.value
        pm_affiliation.create_affiliation(
            trace_id,
            registered_affiliation['MailAddress'],
            registered_affiliation['UserID'],
            registered_affiliation['OrganizationID'],
            registered_affiliation['Authority'],
            registered_affiliation['InvitationStatus'])
        # 未所属ユーザーの作成
        not_belong_affiliation = copy.copy(affiliation_template)
        not_belong_affiliation['MailAddress'] = not_belong_affiliation_address
        not_belong_affiliation['UserID'] = affiliation_template[
            'UserID'].format("not_belong")
        not_belong_affiliation['OrganizationID'] = not_belong_organization_id
        not_belong_affiliation[
            'InvitationStatus'] = InvitationStatus.Belong.value
        not_belong_affiliation['Authority'] = Authority.Viewer.value
        pm_affiliation.create_affiliation(
            trace_id,
            not_belong_affiliation['MailAddress'],
            not_belong_affiliation['UserID'],
            not_belong_affiliation['OrganizationID'],
            not_belong_affiliation['Authority'],
            not_belong_affiliation['InvitationStatus'])
        # 権限不足ユーザー(ビューワー)の作成
        not_enough_permission_affiliation = copy.copy(affiliation_template)
        not_enough_permission_affiliation[
            'MailAddress'] = not_enough_permission_affiliation_address
        not_enough_permission_affiliation[
            'OrganizationID'] = registered_organization_id
        not_enough_permission_affiliation['UserID'] = affiliation_template[
            'UserID'].format("not_enough_permission")
        not_enough_permission_affiliation[
            'InvitationStatus'] = InvitationStatus.Belong.value
        not_enough_permission_affiliation['Authority'] = Authority.Viewer.value
        pm_affiliation.create_affiliation(
            trace_id,
            not_enough_permission_affiliation['MailAddress'],
            not_enough_permission_affiliation['UserID'],
            not_enough_permission_affiliation['OrganizationID'],
            not_enough_permission_affiliation['Authority'],
            not_enough_permission_affiliation['InvitationStatus'])

    def tearDown(self):
        # 所属ユーザーの削除
        pm_affiliation.delete_affiliation(
            user_id=affiliation_template['UserID'].format("registered"),
            organization_id=registered_organization_id)
        # 未所属ユーザーの削除
        pm_affiliation.delete_affiliation(
            user_id=affiliation_template['UserID'].format("not_belong"),
            organization_id=not_belong_organization_id)
        # 権限不足ユーザーの削除
        pm_affiliation.delete_affiliation(
            user_id=affiliation_template['UserID'].format(
                "not_enough_permission"),
            organization_id=registered_organization_id)

    def test_所属ユーザーの権限取得が行える(self):
        trace_id = str(uuid.uuid4())
        result = checkauthority.check_authority(
            trace_id=trace_id,
            user_id=affiliation_template_user_id.format("registered"),
            organization_id=registered_organization_id)
        self.assertTrue(result)

    def test_非所属ユーザーの権限取得時はFalseとする(self):
        trace_id = str(uuid.uuid4())
        result = checkauthority.check_authority(
            trace_id=trace_id,
            user_id=affiliation_template_user_id.format("not_belong"),
            organization_id=registered_organization_id)
        self.assertFalse(result)

    def test_所属ユーザーの権限不足時にFalseとする(self):
        trace_id = str(uuid.uuid4())
        result = checkauthority.check_authority(
            trace_id=trace_id,
            user_id=affiliation_template_user_id.format(
                "not_enough_permission"),
            organization_id=registered_organization_id,
            authority=Authority.Owner)
        self.assertFalse(result)
