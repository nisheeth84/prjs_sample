import uuid


class PmError(Exception):
    cause_error = None
    message = None
    error_id = None
    pm_notification_error = None

    MSG_TEMPLATE = 'error_id: {error_id} message: {message}'

    def __init__(self,
                 cause_error=None,
                 message=None,
                 pm_notification_error=None):
        self.error_id = str(uuid.uuid4())
        self.cause_error = cause_error

        if message is None:
            message = str(cause_error)
            self.message = message
        else:
            self.message = message

        if pm_notification_error is not None:
            self.pm_notification_error = pm_notification_error
        elif hasattr(cause_error, 'pm_notification_error'):
            self.pm_notification_error = cause_error.pm_notification_error

        msg = self.MSG_TEMPLATE.format(
            error_id=self.error_id,
            message=self.message
        )
        super(PmError, self).__init__(msg)


class PmNotificationError:
    check_item_code = None
    region = 'Global'
    code_error = None
    data_body = None

    def __init__(self,
                 check_item_code=None,
                 region=None,
                 code_error=None,
                 data_body=None):
        self.check_item_code = check_item_code
        self.code_error = code_error
        self.data_body = data_body
        if region is not None:
            self.region = region


class NoRetryException(PmError):
    def __init__(self, cause_error=None, message=None):
        super(NoRetryException, self).__init__(
            cause_error=cause_error,
            message=message)


class RetryException(PmError):
    def __init__(self, cause_error=None, message=None):
        super(NoRetryException, self).__init__(
            cause_error=cause_error,
            message=message)
