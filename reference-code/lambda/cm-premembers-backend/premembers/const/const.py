class CommonConst:
    UNKNOWN = "Unknown"
    SCHEMA_VERSION = 1
    SLASH = "/"
    HYPHEN = "-"
    REGEX_SPACE = "\\s"
    BLANK = ""
    SPACE = " "
    ENTER = "\r\n"
    NEW_LINE = "\n"
    COMMA = ","
    EXIT_CODE_SUCCESS = 0
    EXIT_CODE_ERROR = 1
    TASK_RESULT_SUCCESS = "Success"
    TASK_RESULT_FAIL = "Fail"
    SUCCESS = "SUCCESS"
    TCP = "tcp"
    NO_SUCH_KEY = "NoSuchKey"
    NO_SUCH_BUCKET_POLICY = "NoSuchBucketPolicy"
    NO_SUCH_ENTITY = "NoSuchEntity"
    SERVER_SIDE_ENCRYPTION_CONFIGURATION_NOT_FOUND_ERROR = "ServerSideEncryptionConfigurationNotFoundError"
    ALL = "*"
    ALLOW = "Allow"
    CONTENT_TYPE_TEXT_HTML = "text/html"
    NA = "N/A"
    NO_INFORMATION = "no_information"
    COLON = ":"
    ROOT_ACCOUNT = "<root_account>"
    MAX_PASSWORD_REUSE_PREVENTION = 24
    MAX_PASSWORD_AGE = 90
    ASSESSMENT_COMMENT_MAX_LENGTH = 300
    EXCLUSION_COMMENT_MAX_LENGTH = 300
    ASSESSMENT_EXPIRATION_DATE = 180
    EXCLUSION_EXPIRATION_DATE = 180
    EMAIL_CHANGE_APPLY_EXPIRATION_DATE = 1
    EXCLUSIONITEM_ID = "{0}_{1}_{2}_{3}"
    ACCOUNT_REFINE_CODE = "{0}_{1}_{2}"
    CHECK_ITEM_REFINE_CODE = "{0}_{1}_{2}_{3}"
    ASSESSMENTITEM_ID = "{0}_{1}_{2}_{3}"
    SORT_CODE = "{0}_{1}_{2}_{3}"
    KMS_SKIP_EXCEPTION = [
        "AccessDeniedException", "UnsupportedOperationException"
    ]
    AWS_ACCOUNT_MAIL = "{0}-{1}-XXXX"
    S3_SKIP_EXCEPTION = ["AccessDenied", "MethodNotAllowed"]
    PORT_22 = 22
    PORT_3389 = 3389
    CHECK_AWS_COOP = "CHECK_AWS_COOP"
    SYSTEM = "SYSTEM"
    PERSONAL_INFO_MASK = "**********"
    PERSONAL_INFO_KEYS = [
        "UserName",
        "userName",
        "user_name",
        "CompanyName",
        "companyName",
        "company_name",
        "DepartmentName",
        "departmentName",
        "department_name",
        "depertmentName",
        "MailAddress",
        "mailAddress",
        "email",
        "GenerateUser",
        "generateUser",
        "generate_user",
        "temporaryPassword"
    ]
    ERROR = 'ERROR'
    EVENT_SELECTOR_READ_WRITE_TYPE_ALL = "All"

    ASC = "ASC"

    # PATCH CHECK S3
    PATH_CHECK_RAW = "{0}/{1}/{2}/{3}/raw/{4}"
    PATH_CHECK_RESULT = "{0}/{1}/{2}/{3}/check_result/{4}"
    PATH_BATCH_CHECK_LOG = "check_batch/{0}/{1}"
    NOTIFY_CONFIG_CIS_RESULT_MAIL = "check/notify/mail/config.yaml"

    CIDR_IP_NOT_SECURITY = "0.0.0.0/0"

    LOG_GROUP_NAME_STEP_FUNCTIONS = "/cmpremembers/securitycheck/batch"
    FORMAT_STREAM_NAME_STEP_FUNCTIONS = "securitycheck-batch/default/{request_id}"

    # PATCH CHECK S3
    PATH_REPORT_BATCH = "report_batch/{0}/{1}"
    # LEVEL CODE
    LEVEL_CODE_1 = "1"
    LEVEL_CODE_2 = "2"
    LEVEL_CODE_11 = "11"
    LEVEL_CODE_21 = "21"

    # LAMBDA FUNCTION
    EXECUTE_SEND_RESULT_EMAIL = "{0}-{1}-execute_send_result_email"
    EXECUTE_SEND_RESULT_SLACK = "{0}-{1}-execute_send_result_slack"

    NOTIFY_CODE = "CHECK_CIS"

    # ENVIRONMENT
    STAGE = "STAGE"
    S3_SETTING_BUCKET = "S3_SETTING_BUCKET"
    SECURITYCHECK_STATE_MACHINE_ARN = "SECURITYCHECK_STATE_MACHINE_ARN"
    SENDMAIL_ERROR_NOTIFY_TOPIC = "SENDMAIL_ERROR_NOTIFY_TOPIC"
    SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC = "SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC"
    CM_MEMBERS_ROLE_NAME = "CM_MEMBERS_ROLE_NAME"
    INVALID_AWS_COOP_TASK_TOPIC = "INVALID_AWS_COOP_TASK_TOPIC"
    ALLOW_ORIGIN = "ALLOW_ORIGIN"
    SECURITYCHECK_EXECUTE_TOPIC = "SECURITYCHECK_EXECUTE_TOPIC"

    # ROLL NAME
    CM_MEMBERS_PORTAL = "cm-membersportal"

    # TOPIC ARN
    ARN_SNS = "arn:aws:sns"

    # name defult security group
    DEFAULT = 'default'

    US_EAST_REGION = 'us-east-1'
    REGION_IGNORE = ["us-gov-west-1", "cn-north-1", "ap-northeast-3"]
    S3_CHECK_BUCKET = "S3_CHECK_BUCKET"
    GROUP_FILTER_TEMPLATE = "CHECK_{}"

    TASK_TYPE_CODE_DELETE_ORG_USER = "DELETE_ORG_USER"
    TASK_TYPE_CODE_DELETE_ORG = "DELETE_ORG"
    TARGET_DELETE_ORG_USER = "{0},{1}"

    # ALIAS NAME
    KMS_SKIP_ALIAS = "alias/aws/acm"

    DEFAULT_RESPONSE_ERROR_PAGE = {
        'insightwatch': '<html><head><meta http-equiv="refresh" content="0; URL=/app/error.html" /></head></html>'
    }

    COGNITO_USER_NOT_FOUND_EXCEPTION = 'UserNotFoundException'

    LANGUAGE_SUPPORT = ["ja", "en"]
    LANGUAGE_DEFAULT = "ja"
    LANGUAGE_ENGLISH = "en"

    LIST_SERVICE_NAME = ["insightwatch", "opswitch"]
    FILTER_DESCRIBE_REGIONS = [{
        "Name": "opt-in-status",
        "Values": ["opt-in-not-required", "opted-in"]
    }]

    KEY_GET_PATH_FILE_TEMPLATE_MAIL = "{language}.mail.body.text.filepath"
    KEY_GET_PATH_FILE_TEMPLATE_MAIL_SERVICE = "{language}.mail.{serviceName}.body.text.filepath"
    KEY_MAIL_SUBJECT_SERVICE = "{language}.mail.{serviceName}.subject"
    KEY_MAIL_SUBJECT = "{language}.mail.subject"
    KEY_GET_PATH_FILE_TEMPLATE_SLACK = "{language}.slack.message.filepath"
    KEY_USER_NAME_SLACK = "{language}.slack.username"
    KEY_BODY_MESSAGE_SLACK = "{mentions}```{body}```"
    KEY_GET_PATH_FILE_TEMPLATE_USER_INVITE_MAIL = "{language}.invite_mail.{serviceName}.body.text.filepath"
    KEY_MAIL_SUBJECT_USER_INVITE = "{language}.invite_mail.{serviceName}.subject"
    KEY_INVITE_MAIL_FROM_SERVICE = "invite_mail.{serviceName}.from"
    KEY_MAIL_FROM_SERVICE = "mail.{serviceName}.from"
    KEY_RESPONSE_ERROR_PAGE = "mail.{serviceName}.response.error"
    KEY_RESPONSE_EXECUTE_CHANGE_EMAIL = "mail.{serviceName}.response.complete"
    KEY_CODE_ERROR_DEFAULT = 'default'
    KEY_CODE_ERROR_GET_TRAIL_STATUS = 'error_get_trail_status'
    KEY_CODE_ERROR_GET_EVENT_SELECTORS = 'error_get_event_selectors'
    KEY_CODE_ERROR_GET_METRIC_FILTERS = 'error_get_metric_filters'
    KEY_CODE_ERROR_GET_SUBSCRIPTIONS = 'error_get_subscriptions'
    KEY_CODE_ERROR_GET_BUCKET_ACL = 'error_get_bucket_acl'
    KEY_CODE_ERROR_GET_BUCKET_POLICY = 'error_get_bucket_policy'
    KEY_CODE_ERROR_GET_BUCKET_LOGGING = 'error_get_bucket_logging'
    KEY_CODE_ERROR_DESCRIBE_INSTANCES = 'error_describe_instances'
    KEY_CODE_ERROR_ALL_AWSCOOP_DISABLE = 'error_all_awscoop_disable'

    KEY_GET_PATH_FILE_TEMPLATE_CHECK_ERROR_NOTICE_MAIL = "{language}.checkerror_notice_mail.body.text.filepath"
    KEY_CHECK_ERROR_NOTICE_MAIL_SUBJECT = "{language}.checkerror_notice_mail.subject"
    KEY_GET_PATH_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY = "{language}.message_notice_error_execute_check_security.filepath"
    KEY_GET_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY = "{errorCode}.text"

    NUMBER_CHARACTERS_PASSWORD_TEMPORARY = 16
    FORMAT_PASSWORD_TEMPORARY = r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"

    ATTRIBUTE_FILTER_EMAIL = "email"
    ATTRIBUTE_FILTER_USER_STATUS = "cognito:user_status"

    TERM_USER_UNCONFIRMED_DAY = 1
    TERM_USER_FORCE_CHANGE_PASSWORD_DAY = 6

    COGNITO_STATUS_UNCONFIRMED = "UNCONFIRMED"
    COGNITO_STATUS_FORCE_CHANGE_PASSWORD = "FORCE_CHANGE_PASSWORD"

    LIST_CHECK_ITEM_CODE_CONVERT = {
        "CHECK_CIS12_ITEM_1_01": "CIS 1.1",
        "CHECK_CIS12_ITEM_1_02": "CIS 1.2",
        "CHECK_CIS12_ITEM_1_03": "CIS 1.3",
        "CHECK_CIS12_ITEM_1_04": "CIS 1.4",
        "CHECK_CIS12_ITEM_1_05": "CIS 1.5",
        "CHECK_CIS12_ITEM_1_06": "CIS 1.6",
        "CHECK_CIS12_ITEM_1_07": "CIS 1.7",
        "CHECK_CIS12_ITEM_1_08": "CIS 1.8",
        "CHECK_CIS12_ITEM_1_09": "CIS 1.9",
        "CHECK_CIS12_ITEM_1_10": "CIS 1.10",
        "CHECK_CIS12_ITEM_1_11": "CIS 1.11",
        "CHECK_CIS12_ITEM_1_12": "CIS 1.12",
        "CHECK_CIS12_ITEM_1_13": "CIS 1.13",
        "CHECK_CIS12_ITEM_1_14": "CIS 1.14",
        "CHECK_CIS12_ITEM_1_15": "CIS 1.15",
        "CHECK_CIS12_ITEM_1_16": "CIS 1.16",
        "CHECK_CIS12_ITEM_1_17": "CIS 1.17",
        "CHECK_CIS12_ITEM_1_18": "CIS 1.18",
        "CHECK_CIS12_ITEM_1_19": "CIS 1.19",
        "CHECK_CIS12_ITEM_1_20": "CIS 1.20",
        "CHECK_CIS12_ITEM_1_21": "CIS 1.21",
        "CHECK_CIS12_ITEM_1_22": "CIS 1.22",
        "CHECK_CIS12_ITEM_2_01": "CIS 2.1",
        "CHECK_CIS12_ITEM_2_02": "CIS 2.2",
        "CHECK_CIS12_ITEM_2_03": "CIS 2.3",
        "CHECK_CIS12_ITEM_2_04": "CIS 2.4",
        "CHECK_CIS12_ITEM_2_05": "CIS 2.5",
        "CHECK_CIS12_ITEM_2_06": "CIS 2.6",
        "CHECK_CIS12_ITEM_2_07": "CIS 2.7",
        "CHECK_CIS12_ITEM_2_08": "CIS 2.8",
        "CHECK_CIS12_ITEM_2_09": "CIS 2.9",
        "CHECK_CIS12_ITEM_3_01": "CIS 3.1",
        "CHECK_CIS12_ITEM_3_02": "CIS 3.2",
        "CHECK_CIS12_ITEM_3_03": "CIS 3.3",
        "CHECK_CIS12_ITEM_3_04": "CIS 3.4",
        "CHECK_CIS12_ITEM_3_05": "CIS 3.5",
        "CHECK_CIS12_ITEM_3_06": "CIS 3.6",
        "CHECK_CIS12_ITEM_3_07": "CIS 3.7",
        "CHECK_CIS12_ITEM_3_08": "CIS 3.8",
        "CHECK_CIS12_ITEM_3_09": "CIS 3.9",
        "CHECK_CIS12_ITEM_3_10": "CIS 3.10",
        "CHECK_CIS12_ITEM_3_11": "CIS 3.11",
        "CHECK_CIS12_ITEM_3_12": "CIS 3.12",
        "CHECK_CIS12_ITEM_3_13": "CIS 3.13",
        "CHECK_CIS12_ITEM_3_14": "CIS 3.14",
        "CHECK_CIS12_ITEM_4_01": "CIS 4.1",
        "CHECK_CIS12_ITEM_4_02": "CIS 4.2",
        "CHECK_CIS12_ITEM_4_03": "CIS 4.3",
        "CHECK_CIS12_ITEM_4_04": "CIS 4.4",
        "CHECK_ASC_ITEM_01_01": "ASC 01",
        "CHECK_ASC_ITEM_02_01": "ASC 02-01",
        "CHECK_ASC_ITEM_02_02": "ASC 02-02",
        "CHECK_ASC_ITEM_03_01": "ASC 03",
        "CHECK_ASC_ITEM_04_01": "ASC 04",
        "CHECK_ASC_ITEM_05_01": "ASC 05",
        "CHECK_ASC_ITEM_06_01": "ASC 06",
        "CHECK_ASC_ITEM_07_01": "ASC 07",
        "CHECK_ASC_ITEM_08_01": "ASC 08",
        "CHECK_ASC_ITEM_09_01": "ASC 09",
        "CHECK_ASC_ITEM_10_01": "ASC 10",
        "CHECK_ASC_ITEM_11_01": "ASC 11",
        "CHECK_ASC_ITEM_12_01": "ASC 12",
        "CHECK_ASC_ITEM_13_01": "ASC 13",
        "CHECK_ASC_ITEM_14_01": "ASC 14",
        "CHECK_ASC_ITEM_15_01": "ASC 15",
        "CHECK_ASC_ITEM_16_01": "ASC 16",
        "CHECK_IBP_ITEM_01_01": "IBP 01",
        "CHECK_IBP_ITEM_02_01": "IBP 02",
        "CHECK_IBP_ITEM_03_01": "IBP 03",
        "CHECK_IBP_ITEM_04_01": "IBP 04",
        "CHECK_IBP_ITEM_05_01": "IBP 05",
        "CHECK_IBP_ITEM_06_01": "IBP 06",
        "CHECK_IBP_ITEM_07_01": "IBP 07-01",
        "CHECK_IBP_ITEM_07_02": "IBP 07-02",
        "CHECK_IBP_ITEM_07_03": "IBP 07-03",
        "CHECK_IBP_ITEM_07_04": "IBP 07-04",
        "CHECK_IBP_ITEM_07_05": "IBP 07-05",
        "CHECK_IBP_ITEM_07_06": "IBP 07-06",
        "CHECK_IBP_ITEM_07_07": "IBP 07-07",
        "CHECK_IBP_ITEM_07_08": "IBP 07-08",
        "CHECK_IBP_ITEM_08_01": "IBP 08",
        "CHECK_IBP_ITEM_09_01": "IBP 09",
        "CHECK_IBP_ITEM_10_01": "IBP 10",
        "CHECK_IBP_ITEM_11_01": "IBP 11",
        "CHECK_IBP_ITEM_12_01": "IBP 12",
        "CHECK_IBP_ITEM_13_01": "IBP 13",
        "CHECK_IBP_ITEM_14_01": "IBP 14-01",
        "CHECK_IBP_ITEM_14_02": "IBP 14-02",
        "CHECK_IBP_ITEM_14_03": "IBP 14-03",
        "CHECK_IBP_ITEM_14_04": "IBP 14-04",
        "CHECK_IBP_ITEM_14_05": "IBP 14-05"
    }
