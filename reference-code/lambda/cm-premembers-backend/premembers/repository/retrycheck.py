retry_status_codes = [500, 503]
retry_exceptions = [
    "ItemCollectionSizeLimitExceededException", "LimitExceededException",
    "ProvisionedThroughputExceededException", "ThrottlingException",
    "UnrecognizedClientException"
]


def check_retryable(client_error_response):
    http_status_code = client_error_response['ResponseMetadata'][
        'HTTPStatusCode']
    if(http_status_code in retry_status_codes):
        return True
    else:
        error_code = client_error_response['Error']['Code']
        return error_code in retry_exceptions
