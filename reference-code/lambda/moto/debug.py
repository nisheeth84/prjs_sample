from __future__ import unicode_literals


import boto3
from freezegun import freeze_time
import requests
from botocore.exceptions import ClientError

import responses
from moto import mock_apigateway, settings


@freeze_time("2015-01-01")
@mock_apigateway
def test_create_and_get_rest_api():
    client = boto3.client('apigateway', region_name='us-west-2')

    response = client.create_rest_api(
        name='my_api',
        description='this is my api',
    )
    api_id = response['id']

    response = client.get_rest_api(
        restApiId=api_id
    )

    response.pop('ResponseMetadata')
    response.pop('createdDate')
    response.should.equal({
        'id': api_id,
        'name': 'my_api',
        'description': 'this is my api',
    })

if __name__ == "__main__":
    test_create_and_get_rest_api()