from tests.mock.data.aws.data_common import DataCommon


class DataTestSns:
    TASK_ID = 'TaskId'
    SUBJECT = 'TASK : ' + TASK_ID
    MESSAGE = {
        'TaskId': TASK_ID,
        'Code': 'DELETE_ORG',
        'OrganizationID': DataCommon.ORGANIZATION_ID_TEST.format(3),
        'UserID': DataCommon.USER_ID_TEST.format(3)
    }

    MESSAGE_NOT_EXISTS_ORGANIZATION_ID_AND_USER_ID = {
        'TaskId': TASK_ID,
        'Code': 'DELETE_ORG'
    }
