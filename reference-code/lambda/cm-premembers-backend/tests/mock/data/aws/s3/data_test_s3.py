from premembers.common import common_utils

class DataTestS3():
    LOCATION_BUCKET = "us-west-1"

    INFO_BUCKET = {
        "Bucket": "example-user-bucket",
        "ACL": "log-delivery-write"
    }

    DATA_TEST_UPLOAD_S3 = {
        'AWSAccount': "aws_account",
        'CheckResults': "check_results",
        'DateTime': "current_date"
    }

    DATA_TEST_UPLOAD_JSON = {'AllowUsersToChangePassword': True, 'ExpirePasswords': False, 'MinimumPasswordLength': 8, 'RequireLowercaseCharacters': True, 'RequireNumbers': True, 'RequireSymbols': True, 'RequireUppercaseCharacters': True}

    DATA_TEST_UPLOAD_CSV = "user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated\n<root_account>,arn:aws:iam::896456754057:root,2019-01-28T01:18:01+00:00,not_supported,2019-07-03T04:17:54+00:00,not_supported,not_supported,true,false,N/A,N/A,N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"

    S3_FILE_NAME_JSON = "check_history_id/organization_id/project_id/awsaccount/raw/filename.json"
    S3_FILE_NAME_CSV = "check_history_id/organization_id/project_id/awsaccount/raw/filename.csv"
    S3_FILE_NAME_YAML = "check/notify/mail/config.yaml"

    BUCKET_LOGGING = {
        "Bucket": INFO_BUCKET["Bucket"],
        "BucketLoggingStatus": {
            "LoggingEnabled": {
                "TargetBucket": "example-user-bucket",
                "TargetGrants": [
                    {
                        "Grantee": {
                            "ID": "SOMEIDSTRINGHERE9238748923734823917498237489237409123840983274",
                            "Type": "CanonicalUser"
                        },
                        "Permission": "WRITE"
                    },
                ],
                "TargetPrefix": "user/"
            }
        }
    }

    ACCESS_CONTROL_POLICY = {
        "Grants": [
            {
                "Grantee": {
                    "URI": "http://acs.amazonaws.com/groups/s3/LogDelivery",
                    "Type": "Group"
                },
                "Permission": "WRITE"
            }
        ],
        "Owner": {
            "DisplayName": "webfile",
            "ID": "75aa57f09aa0c8caeab4f8c24e99d10f8e7faeebf76c078efc7c6caea54ba06a"
        }
    }

    BUCKET_ACL = {
        'Owner': {
            'DisplayName': 'spare-0716',
            'ID': '4b5e1f0e4eb28926846a168e7646a9435dd795ad8d5f548a0e2e5dd4ad6b12c1'
        },
        'Grants': [
            {
                'Grantee': {
                    'DisplayName': 'spare-0716',
                    'ID': '4b5e1f0e4eb28926846a168e7646a9435dd795ad8d5f548a0e2e5dd4ad6b12c1',
                    'Type': 'CanonicalUser'
                },
                'Permission': 'FULL_CONTROL'
            },
        ]
    }

    BUCKET_POLICY = {
        'ResponseMetadata': {
            'RequestId': 'A629F2B520258404',
            'HostId':
            'EzR9UtHj9sx9gyk4Ds3ApN5Kvddq7j9ypDcXT0Gedbb67VJAqNkojF94d7xXti1/ZhSkcRTDP8M=',
            'HTTPStatusCode': 200,
            'HTTPHeaders': {
                'x-amz-id-2': 'EzR9UtHj9sx9gyk4Ds3ApN5Kvddq7j9ypDcXT0Gedbb67VJAqNkojF94d7xXti1/ZhSkcRTDP8M=',
                'x-amz-request-id': 'A629F2B520258404',
                'date': 'Tue, 27 Aug 2019 03:18:33 GMT',
                'content-type': 'application/json',
                'content-length': '521',
                'server': 'AmazonS3'
            },
            'RetryAttempts': 0
        },
        'Policy':
        '{"Version":"2012-10-17","Statement":[{"Sid":"AWSCloudTrailAclCheck20150319","Effect":"Allow","Principal":"*","Action":"s3:GetBucketAcl","Resource":"arn:aws:s3:::cloudtrail-ap-south-1-216054658829"},{"Sid":"AWSCloudTrailWrite20150319","Effect":"Allow","Principal":"*","Action":"s3:PutObject","Resource":"arn:aws:s3:::cloudtrail-ap-south-1-216054658829/AWSLogs/216054658829/*","Condition":{"StringEquals":{"s3:x-amz-acl":"bucket-owner-full-control"}}}]}'
    }

    BUCKET_ENCRYPTION = {
        "ServerSideEncryptionConfiguration": {
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256",
                        "KMSMasterKeyID": "string"
                    }
                },
            ]
        }
    }

    NOTIFY_CONFIG_CIS_RESULT_MAIL = "check/notify/mail/config.yaml"
    S3_SETTING_BUCKET = 'S3_SETTING_BUCKET'

    DATA_CONFIG = {
        'ses.region': 'us-west-2',
        'ja.mail.subject': '[insightwatch(DEV)]セキュリティチェック結果通知（{{project_name}}）',
        'en.mail.subject': '[insightwatch(DEV)]Security check result notification （{{project_name}}）',
        'en.mail.body.text.filepath': 'check/notify/mail/cis_checkresult_template_en.tpl',
        'ja.mail.body.text.filepath': 'check/notify/mail/cis_checkresult_template_ja.tpl',
        'mail.from': 'sys@dev.insightwatch.io',
        'ja.slack.username': 'insightwatch(DEV)',
        'en.slack.username': 'insightwatch(DEV)',
        'slack.iconurl': 'https://insightwatch.io/app/assets/images/iw_em_color_slack_file.png',
        'ja.slack.message.filepath': 'check/notify/mail/checkresult_slack_template_ja.tpl',
        'en.slack.message.filepath': 'check/notify/mail/checkresult_slack_template_en.tpl',
        'ja.invite_mail.insightwatch.subject': '[insightwatch(DEV)]へ招待されました',
        'ja.invite_mail.insightwatch.body.text.filepath': 'check/notify/mail/insightwatch_user_invite_template_ja.tpl',
        'en.invite_mail.insightwatch.subject': 'Youre Invited: insightwatch(DEV)',
        'en.invite_mail.insightwatch.body.text.filepath': 'check/notify/mail/insightwatch_user_invite_template_en.tpl',
        'invite_mail.insightwatch.from': 'sys@dev.insightwatch.io',
        'ja.invite_mail.opswitch.subject': '[opswitch(DEV)]へ招待されました',
        'ja.invite_mail.opswitch.body.text.filepath': 'check/notify/mail/opswitch_user_invite_template_ja.tpl',
        'en.invite_mail.opswitch.subject': 'Youre Invited: opswitch(DEV)',
        'en.invite_mail.opswitch.body.text.filepath': 'check/notify/mail/opswitch_user_invite_template_en.tpl',
        'invite_mail.opswitch.from': 'sys@dev.insightwatch.io',
        'ja.checkerror_notice_mail.subject': '[insightwatch(DEV)]セキュリティチェック処理でエラーが発生しました。（{{project_name}}）',
        'en.checkerror_notice_mail.subject': '[insightwatch(DEV)]Security check error alert（{{project_name}}）',
        'en.checkerror_notice_mail.body.text.filepath': 'check/notify/mail/notice_error_execute_check_en.tpl',
        'ja.checkerror_notice_mail.body.text.filepath': 'check/notify/mail/notice_error_execute_check_ja.tpl',
        'en.message_notice_error_execute_check_security.filepath': 'check/notify/mail/message_notice_error_execute_check_security_en.yaml',
        'ja.message_notice_error_execute_check_security.filepath': 'check/notify/mail/message_notice_error_execute_check_security_ja.yaml',
        'mail.subject': 'insightwatch(DEV) メールアドレス変更確認 / Confirm your change e-mail address',
        'mail.body.text.filepath': 'check/notify/mail/apply_change_mail_template.tpl',
        'mail.from': 'sys@dev.insightwatch.io',
        'mail.insightwatch.response.complete': '<html><head><meta http-equiv="refresh" content="0; URL=/app/#/emailchangecomplete.html" /></head></html>',
        'mail.insightwatch.response.error': '<html><head><meta http-equiv="refresh" content="0; URL=/app/error.html" /></head></html>',
        'mail.opswitch.response.complete': '<html><head><meta http-equiv="refresh" content="0; URL=https://app.dev.opswitch.io/emailchangecomplete" /></head></html>',
        'mail.opswitch.response.error': '<html><head><meta http-equiv="refresh" content="0; URL=https://app.dev.opswitch.io/emailchangeerror" /></head></html>',
        "ja.mail.insightwatch.subject": "insightwatch(DEV) メールアドレス変更確認",
        "en.mail.insightwatch.subject": "Confirm your change e-mail address",
        "ja.mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_apply_change_mail_template_ja.tpl",
        "en.mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_apply_change_mail_template_en.tpl",
        "mail.insightwatch.from": "sys@dev.insightwatch.io",
        "ja.mail.opswitch.subject": "opswitch(DEV) メールアドレス変更確認",
        "en.mail.opswitch.subject": "Confirm your change e-mail address",
        "ja.mail.opswitch.body.text.filepath": "check/notify/mail/opswitch_apply_change_mail_template_ja.tpl",
        "en.mail.opswitch.body.text.filepath": "check/notify/mail/opswitch_apply_change_mail_template_en.tpl",
        "mail.opswitch.from": "sys@dev.opswitch.io"
    }

    MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA = {
        'default.text': 'チェック実行時にエラーが発生しました。再度、チェックを実施してください。\nもし、再度エラーが発生する場合は、お手数ですがサポートへお問い合わせください。',
        'error_get_bucket_acl.text': 'CloudTrailに指定されたログ出力先の{S3BucketName}バケットが存在しない、もしくは別アカウントのS3バケットである、などが原因でS3バケット情報を取得できずチェックがエラー終了しました。\n{S3BucketName}バケットの存在とバケットへの権限を確認し、再度チェックを実施してください。\nもし、再度エラーが発生する場合、お手数ですがサポートへお問い合わせください。\n',
        'error_get_bucket_policy.text': 'CloudTrailに指定されたログ出力先の{S3BucketName}バケットが存在しない、もしくは別アカウントのS3バケットである、などが原因でS3バケット情報を取得できずチェックがエラー終了しました。\n{S3BucketName}バケットの存在とバケットへの権限を確認し、再度チェックを実施してください。\nもし、再度エラーが発生する場合、お手数ですがサポートへお問い合わせください。\n',
        'error_get_trail_status.text': 'CloudTrailの情報取得に失敗しました。CloudTrail {TrailARN} が存在しない、もしくはCloudTrailへアクセスできない場合、チェックがエラー終了します。\nCloudTrail {TrailARN} が存在しており、操作権限を持っていることを確認してから、再度チェックを実施してください。\nもし、再度エラーが発生する場合、お手数ですがサポートへお問い合わせください。\n',
        'error_get_event_selectors.text': 'CloudWatchのイベントセレクター情報 {TrailARN} の取得に失敗しました。\nCWLogsロググループが存在しない、もしくは、ロググループへアクセスできない場合、イベントセレクター情報が取得できずチェックがエラー終了します。\nCWLogsロググループが存在しており、そのグループへの操作権限を持っていることを確認してから、再度チェックを実施してください。\nもし、再度エラーが発生する場合、お手数ですがサポートへお問い合わせください。',
        'error_get_metric_filters.text': 'CloudWatchのメトリックスフィルタ情報の取得に失敗しました。CWLogsロググループ {CloudTrailLogGroupName} が存在しない、もしくは、ロググループへアクセスできない場合、メトリックスフィルタ情報が取得できずチェックがエラー終了します。\nCWLogsロググループが存在しており、そのグループへの操作権限を持っていることを確認してから、再度チェックを実施してください。\nもし、再度エラーが発生する場合、お手数ですがサポートへお問い合わせください。',
        'error_get_subscriptions.text': 'CloudTrailに設定されたSNSトピック情報 {TopicArn} の取得に失敗しました。SNSトピックが存在しないか、もしくは権限がない場合、チェック実行がエラー終了します。\nSNSトピックの存在を確認し、適切な操作権限が設定されていることを確認し、再度チェックを実施してください。\nもし、再度エラーが発生する場合、お手数ですがサポートへお問い合わせください。',
        'error_describe_instances.text': 'リージョン {RegionName} のEC2インスタンス情報取得が取得できずチェックがエラー終了しました。\nリージョン {RegionName} でEC2インスタンス情報へのアクセス権限を確認し、再度チェックを実施してください。\nもし、再度エラーが発生する場合、お手数ですがサポートへお問い合わせください。',
        'error_all_awscoop_disable.text': 'お客様が実行したプロジェクトに設定されたAWSアカウントへinsightwatchがアクセスできませんでした。\ninsightwatchは、ユーザーのAWSアカウントとIAMロールにより連携されています。このIAMロールが削除されたり、アクセス権限を変更するとチェック処理がエラーになる場合があります。チェックエラーが発生する場合、IAMロールの「insightwatch-IAMRole-XXXXXXXXXXXXX」を確認してください。\n解決しない場合、再度AWSアカウント連携を実施してください。\n・AWSアカウントと連携する\nhttps://insightwatch.zendesk.com/hc/ja/articles/360002029792\n\n--\n※本メールは送信専用メールアドレスから送信されています。返信はできませんのでご了承ください。\nお問い合わせは下記フォームからお送りください。\nhttps://insightwatch.zendesk.com/hc/ja/requests/new\nClassmethod, Inc.'
    }

    TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA = 'insightwatch（インサイトウオッチ）をご利用のお客様\n\nお客様が実行したセキュリティチェック処理中にエラーが発生し、チェックが完了しませんでした。\nチェックがエラーになった組織やプロジェクト、エラーの内容は下記の通りです。\n\n組織名：{{organizationName}}\nプロジェクト名：{{projectName}}\n{%- if awsAccount %}\nAWSアカウント : {{awsAccount}}\n{%- endif %}\n{%- if checkCodeItem %}\nチェック項目コード : {{checkCodeItem}}\n{%- endif %}\n{%- if regionName %}\nリージョン : {{regionName}}\n{%- endif %}\n\n{{contentMessage}}\n'

    PATH_FILE_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA = 'check/notify/mail/message_notice_error_execute_check_security_ja.yaml'
    PATH_NOTICE_ERROR_EXECUTE_CHECK_JA = 'check/notify/mail/notice_error_execute_check_ja.tpl'
    PATH_FILE_CONFIG = 'check/notify/mail/config.yaml'
