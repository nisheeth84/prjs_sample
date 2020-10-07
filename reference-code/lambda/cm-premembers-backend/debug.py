from premembers.check.batch import awssecuritychecks
from tests import event_create


event_mock = {
    "AWSAccount": "216054658829",
    "CoopID": "e206e0dd-fbc0-47a9-8577-bfa2c656065a",
    "RoleName": "insightwatch-dev-IAMRole-18TL7SRKGI6PL",
    "ExternalID": "4defd5cf-e3d7-49de-932f-b9bdd9276b5f",
    "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
    "ProjectID": "2458d17c-8dff-4983-9a36-e9e964058fd7",
    "CheckHistoryId": "27c4b14c-38e3-4e99-81a6-6c43b0f96ec7",
    "AWSAccountName": "IW開発環境",
    "OrganizationName": "OrganizationName",
    "ProjectName": "ProjectName",
    "CheckResultID": "CheckResultID",
    "effective_awsaccount": {
        "TaskResult": "Success",
        "Members": 1,
        "AccountCoop": "1"
    }
}

# event_mock = event_create.get_event_object(path_parameters=path_parameters)

awssecuritychecks.execute_asc_check_handler(event_mock, {})
