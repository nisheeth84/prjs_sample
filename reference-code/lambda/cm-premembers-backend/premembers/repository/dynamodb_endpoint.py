import os


def get_endpoint():
    endpoint = os.environ.get("DYNAMODB_ENDPOINT")
    return endpoint
