class DataTestSes:

    TRACE_ID = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
    REGIONS = 'us-east-1'
    SENDER = 'test_user@luvina.net'
    BCC = ['test_user1@luvina.net']
    SUBJECT = 'Test send mail'
    BODY = '''
        Dear insightwatch customer,

        Below is a summary of your security checkup.
        {{organizationName}}: {{projectName}}
        Report date and time: {{executedDateTimeUTC}} (UTC)

        {% for checkResult in checkResults %}
        {{checkResult.accountAWS}} : Managed({{checkResult.managedCount}}) / Normal({{checkResult.okCount}}) / Warning({{checkResult.ngCount}}) / Critical({{checkResult.criticalCount}}) / Error({{checkResult.errorCount}}){{'\t'}}{% endfor %}

        For details and recommendations, visit insightwatch (https://insightwatch.io).

        =====================================================================
        【For customers who want to lower cost as well as AWS security risk】

        AWS general support service of class method, consulting about AWS construction, AWS infrastructure management,{{'\t'}}
        Classmethod takes charge of security monitoring on a 24/7 basis, and customers focus on business{{'\t'}}
        We provide various support and best practices of AWS.
        And there is a 5% discount on usage charges for all AWS services and regions.
        You only need to enter the required information in the application form to get started.

        Details: https://classmethod.jp/services/members/
        =====================================================================

        Please do not reply to this email. We are unable to respond to inquiries sent to this address.
        --
        insightwatch (https://insightwatch.io)
        Classmethod, Inc.
    '''

    DESTINATION = {'BccAddresses': BCC}
    MESSAGE = {
        'Subject': {
            'Data': SUBJECT,
            'Charset': 'UTF-8'
        },
        'Body': {
            'Text': {
                'Data': BODY,
                'Charset': 'UTF-8'
            }
        }
    }
