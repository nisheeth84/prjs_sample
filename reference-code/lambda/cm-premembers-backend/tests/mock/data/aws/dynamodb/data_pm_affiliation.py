import copy

from premembers.common import common_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmAffiliation():
    USER_ID = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    TRACE_ID = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
    DATE_NOW = common_utils.get_current_date()
    AFFILIATION_TEMPLATE_ADDRESS = "test-user{}example.com"
    AFFILIATION_TEMPLATE_USER_ID = USER_ID
    AFFILIATION_TEMPLATE_ORGANIZATION_ID = "3388259c-7821-11e7-9fb6-bb2200a6cdd"
    AFFILIATION_TEMPLATE_ORGANIZATION_ID_TEMPLATE = ORGANIZATION_ID
    AFFILIATION_TEMPLATE_AUTHORITY = 3
    AFFILIATION_TEMPLATE_INVITATION_STATUS = 0
    AFFILIATION_TEMPLATE = {
        "MailAddress": AFFILIATION_TEMPLATE_ADDRESS,
        "UserID": USER_ID,
        "Authority": AFFILIATION_TEMPLATE_AUTHORITY,
        "OrganizationID": ORGANIZATION_ID,
        "InvitationStatus": AFFILIATION_TEMPLATE_INVITATION_STATUS,
        "CreatedAt": DATE_NOW,
        "UpdatedAt": DATE_NOW
    }

    AFFILIATION_AUTHORITY_VIEWER = {
        "InvitationStatus": 1,
        "MailAddress": "luvina_test@luvina.net",
        "Authority": 1,
        "UserID": copy.deepcopy(DataCommon.USER_ID_TEST.format(str(1))),
        "OrganizationID": ORGANIZATION_ID,
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date()
    }

    LIST_AFFILIATIONS = [
        {
            "MailAddress": AFFILIATION_TEMPLATE_ADDRESS,
            "UserID": USER_ID,
            "Authority": AFFILIATION_TEMPLATE_AUTHORITY,
            "OrganizationID": ORGANIZATION_ID,
            "InvitationStatus": AFFILIATION_TEMPLATE_INVITATION_STATUS,
            "CreatedAt": common_utils.get_current_date(),
            "UpdatedAt": common_utils.get_current_date()
        },
        {
            "MailAddress": AFFILIATION_TEMPLATE_ADDRESS,
            "UserID": USER_ID,
            "Authority": AFFILIATION_TEMPLATE_AUTHORITY,
            "OrganizationID": copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(1))),
            "InvitationStatus": AFFILIATION_TEMPLATE_INVITATION_STATUS,
            "CreatedAt": common_utils.get_current_date(),
            "UpdatedAt": common_utils.get_current_date()
        }
    ]
