from enum import IntEnum


class Authority(IntEnum):
    Owner = 3
    Editor = 2
    Viewer = 1


class InvitationStatus(IntEnum):
    Invited = 0
    Belong = 1
    Deny = -1


class Status(IntEnum):
    Waiting = 0
    Running = 1
    Done = 2
    Error = -1


class Effective(IntEnum):
    Enable = 1
    Disable = -1
    UnConfirmed = 0


class ReportStatus(IntEnum):
    Standby = 0
    CollectInfo = 1
    CollectEdit = 2
    EditFinish = 3
    ConvertFinish = 4
    StatusError = -1


class ExcelStatus(IntEnum):
    Waiting = 0
    Processing = 1
    Finish = 2
    Error = -1


class CheckStatus:
    Waiting = 0
    CheckProgress = 1
    CheckCompleted = 2
    SummaryProgress = 3
    SummaryCompleted = 4
    ReportProgress = 5
    ReportCompleted = 6


class CheckResult:
    Normal = 0
    MinorInadequacies = 1
    CriticalDefect = 2
    MembersManagement = -1
    Error = 99


class ExecutedType:
    Auto = "AUTO"
    Manual = "MANUAL"
    External = "EXTERNAL"


class Members:
    Enable = 1
    Disable = 0


class AssessmentFlag:
    NotManual = -1
    NotAssessment = 0
    Assessment = 1


class ExclusionFlag:
    Enable = 1
    Disable = 0


class ManagedFlag:
    Managed = 1
    NotManaged = 0


class ExcludedResourceFlag:
    Enable = 1
    Disable = 0
    Other = -1


class MailStatus:
    Normal = 0


class MessageAction:
    Suppress = "SUPPRESS"


class RegionName:
    Global = "Global"


class ResourceType:
    S3BucketName = "S3BucketName"
    VpcId = "VpcId"
    User = "user"
    Role = "role"
    Group = "group"
    GroupId = "GroupId"
    CloudTrailName = "CloudTrailName"
    KeyId = "KeyId"
    InstanceId = "InstanceId"
