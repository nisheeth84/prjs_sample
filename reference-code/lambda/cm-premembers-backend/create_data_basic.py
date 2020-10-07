import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from pathlib import Path
from premembers.repository import pm_affiliation, pm_awsAccountCoops
from premembers.repository import pm_exclusionitems, pm_assessmentItems
from premembers.repository import pm_organizations, pm_projects
from premembers.const.msg_const import MsgConst
from tests import event_create
from premembers.common import common_utils
from premembers.check.handler import checkitemsettings
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError


trace_id = common_utils.get_uuid4()

try:
    awsAccountCoops = [
        {
            "RoleName": "insightwatch-dev-IAMRole-18TL7SRKGI6PL",
            "Description": "\u958b\u767a\u74b0\u5883",
            "AWSAccount": "216054658829",
            "CreatedAt": "2017-12-05 03:12:53.229",
            "ExternalID": "4defd5cf-e3d7-49de-932f-b9bdd9276b5f",
            "ProjectID": "2458d17c-8dff-4983-9a36-e9e964058fd7",
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "AWSAccountName": "IW\u958b\u767a\u74b0\u5883",
            "CoopID": "e206e0dd-fbc0-47a9-8577-bfa2c656065a",
            "UpdatedAt": "2018-03-28 05:51:22.533",
            "Members": 1,
            "Effective": 1
        },
        {
            "RoleName": "premembers-dev-role",
            "Description": "\u30b9\u30c6\u30fc\u30b8\u30f3\u30b0\u74b0\u5883",
            "AWSAccount": "749077664194",
            "CreatedAt": "2017-10-02 02:48:22.137",
            "ExternalID": "75D76423-6214-457E-BE58-AA7AD93C91BE",
            "ProjectID": "2458d17c-8dff-4983-9a36-e9e964058fd7",
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "AWSAccountName": "IW\u30b9\u30c6\u30fc\u30b8\u30f3\u30b0\u74b0\u5883",
            "CoopID": "64df67c1-3a7f-472d-8c60-2fd67e2eedb6",
            "UpdatedAt": "2018-03-28 06:07:19.566",
            "Members": 1,
            "Effective": 1
        },
        {
            "RoleName": "insightwatch-dev-role-IAMRole-10OKFM33D45K7",
            "Description": "\u672c\u756a\u74b0\u5883",
            "AWSAccount": "267458812797",
            "CreatedAt": "2017-11-27 03:42:06.970",
            "ExternalID": "9d82a699-824d-44e4-b23c-cab04fe9a9c4",
            "ProjectID": "2458d17c-8dff-4983-9a36-e9e964058fd7",
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "AWSAccountName": "HungGK",
            "CoopID": "1ba3b329-fef8-4c69-ab86-a12188f3c361",
            "UpdatedAt": "2018-03-28 05:59:45.874",
            "Members": 1,
            "Effective": 1
        }
    ]

    projects = [
        {
            "ProjectID": "2458d17c-8dff-4983-9a36-e9e964058fd7",
            "Description": "\u30a4\u30f3\u30b5\u30a4\u30c8\u30a6\u30a9\u30c3\u30c1\u958b\u767a\u30d7\u30ed\u30b8\u30a7\u30af\u30c8",
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "ProjectName": "\u30a4\u30f3\u30b5\u30a4\u30c8\u30a6\u30a9\u30c3\u30c1\u958b\u767a",
            "UpdatedAt": "2017-10-02 02:46:48.244",
            "CreatedAt": "2017-10-02 02:46:48.244"
        }
    ]

    organizations = [
        {
            "OrganizationName": "\u30a4\u30f3\u30b5\u30a4\u30c8\u30a6\u30a9\u30c3\u30c1",
            "ContractStatus": 1,
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "Contract": 0,
            "UpdatedAt": "2017-10-02 02:46:14.651",
            "CreatedAt": "2017-10-02 02:46:14.651"
        }
    ]

    affiliations = [
        {
            "InvitationStatus": 1,
            "MailAddress": "ngovanhai@luvina.net",
            "Authority": 3,
            "UserID": "ee0627fd-3693-49b0-904e-11466915e602",
            "CreatedAt": "2017-11-23 07:46:14.520",
            "OrganizationID": "20b51959-edb6-4b2b-9c4e-75e983e562da",
            "UpdatedAt": "2017-11-23 07:46:14.520"
        },
        {
            "InvitationStatus": 1,
            "MailAddress": "tago.masayuki@classmethod.jp",
            "Authority": 3,
            "UserID": "ee0627fd-3693-49b0-904e-11466915e602",
            "CreatedAt": "2017-11-23 07:46:14.520",
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "UpdatedAt": "2017-11-23 07:46:14.520"
        }
    ]

    for awsAccountCoop in awsAccountCoops:
        pm_awsAccountCoops.create_awscoops(
                trace_id, awsAccountCoop['CoopID'],
                awsAccountCoop['AWSAccount'],
                awsAccountCoop['AWSAccountName'],
                awsAccountCoop['RoleName'],
                awsAccountCoop['ExternalID'],
                awsAccountCoop['Description'],
                awsAccountCoop['Effective'],
                awsAccountCoop['OrganizationID'],
                awsAccountCoop['ProjectID'])

    for project in projects:
        pm_projects.create_projects(
            trace_id, project['ProjectID'], project['ProjectName'],
            project['Description'], project['OrganizationID'])

    for organization in organizations:
        pm_organizations.create_organization(
            trace_id, organization['OrganizationID'],
            organization['OrganizationName'],
            organization['Contract'],
            organization['ContractStatus'])

    for affiliation in affiliations:
        pm_affiliation.create_affiliation(
            trace_id, affiliation['MailAddress'], affiliation['UserID'],
            affiliation['OrganizationID'], affiliation['Authority'],
            affiliation['InvitationStatus'])


except Exception as error:
    raise PmError(cause_error=error)
