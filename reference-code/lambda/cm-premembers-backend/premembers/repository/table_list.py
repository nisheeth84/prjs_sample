from enum import Enum
import os
import re

prefix = os.environ.get("STAGE")
p = re.compile("PREM*")
if prefix is None or p.match(prefix) is None:
    prefix = ""
else:
    prefix += "_"


class Tables(Enum):
    PM_AWSACCOUNTCOOPS = "{}{}".format(prefix, "PM_AWSAccountCoops")
    PM_AFFILIATION = "{}{}".format(prefix, "PM_Affiliation")
    PM_ORGANIZATIONS = "{}{}".format(prefix, "PM_Organizations")
    PM_ORGANIZATION_TASKS = "{}{}".format(prefix, "PM_OrganizationTasks")
    PM_PROJECTS = "{}{}".format(prefix, "PM_Projects")
    PM_REPORTS = "{}{}".format(prefix, "PM_Reports")
    PM_BATCH_JOB_DEFS = "{}{}".format(prefix, "PM_BatchJobDefs")
    PM_REPORT_JOB_LOGS = "{}{}".format(prefix, "PM_ReportJobLogs")
    PM_DAILY_CHECK_EXECUTED_AWSACCOUNTS = "{}{}".format(
        prefix, "PM_DailyCheckExecutedAWSAccounts")
    PM_CHECKS = "{}{}".format(prefix, "PM_Checks")
    PM_REPORT_JOB_DEFS = "{}{}".format(prefix, "PM_ReportJobDefs")
    PM_CHECK_RESULTS = "{}{}".format(prefix, "PM_CheckResults")
    PM_CHECK_RESULT_ITEMS = "{}{}".format(prefix, "PM_CheckResultItems")
    PM_USER_ATTRIBUTE = "{}{}".format(prefix, "PM_UserAttribute")
    PM_CHECK_HISTORY = "{}{}".format(prefix, "PM_CheckHistory")
    PM_LATEST_CHECK_RESULT = "{}{}".format(prefix, "PM_LatestCheckResult")
    PM_ASSESSMENT_ITEMS = "{}{}".format(prefix, "PM_AssessmentItems")
    PM_EXCLUSION_ITEMS = "{}{}".format(prefix, "PM_ExclusionItems")
    PM_EXCLUSION_RESOURCES = "{}{}".format(prefix, "PM_ExclusionResources")
    PM_ORG_NOTIFY_MAIL_DESTINATIONS = "{}{}".format(
        prefix, "PM_OrgNotifyMailDestinations")
    PM_SECURITY_CHECK_WEBHOOK = "{}{}".format(prefix,
                                              "PM_SecurityCheckWebhook")
    PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY = "{}{}".format(
        prefix, "PM_SecurityCheckWebhookCallHistory")
    PM_EMAIL_CHANGE_APPLY = "{}{}".format(prefix, "PM_EmailChangeApply")
    PM_ORG_NOTIFY_SLACK = "{}{}".format(prefix, "PM_OrgNotifySlack")
