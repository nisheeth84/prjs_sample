#!/bin/bash
cd `dirname $0` || exit 1
. ./args.conf
cd ..
if [ -v STAGE ];then
    if [ ! -n "$STAGE" ] ; then
        STAGE=$BRANCH
    fi
else
  STAGE=$BRANCH
fi
case $AWS_ACCOUNT_ID in
216054658829 ) 
    S3_SETTING_BUCKET='premembers-dev-setting'
    SENDMAIL_ERROR_NOTIFY_TOPIC='arn:aws:sns:ap-northeast-1:216054658829:Premembers-report-batch-error-notification' 
    SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC='arn:aws:sns:ap-northeast-1:216054658829:Premembers-Securitycheck-batch-error-notify'
    SECURITYCHECK_STATE_MACHINE_ARN='arn:aws:states:ap-northeast-1:216054658829:stateMachine:premembers-backend-SecurityCheckExec'
    SECURITYCHECK_EXECUTE_TOPIC='arn:aws:sns:ap-northeast-1:216054658829:Premembers-SecurityCheck-Execute-Topic'
    if [[ $STAGE == "develop" ]]; then
        aws s3 cp ./setting/check/notify/mail/cis_checkresult_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/cis_checkresult_template_ja.tpl
        aws s3 cp ./setting/check/notify/mail/cis_checkresult_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/cis_checkresult_template_en.tpl
        aws s3 cp ./setting/check/notify/mail/dev_config.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/config.yaml
        aws s3 cp ./setting/check/notify/mail/dev_insightwatch_apply_change_mail_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_apply_change_mail_template_en.tpl
        aws s3 cp ./setting/check/notify/mail/dev_insightwatch_apply_change_mail_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_apply_change_mail_template_ja.tpl
        aws s3 cp ./setting/check/notify/mail/dev_opswitch_apply_change_mail_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_apply_change_mail_template_en.tpl
        aws s3 cp ./setting/check/notify/mail/dev_opswitch_apply_change_mail_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_apply_change_mail_template_ja.tpl
        aws s3 cp ./setting/check/notify/mail/notice_error_execute_check_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/notice_error_execute_check_ja.tpl
        aws s3 cp ./setting/check/notify/mail/notice_error_execute_check_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/notice_error_execute_check_en.tpl
        aws s3 cp ./setting/check/notify/mail/message_notice_error_execute_check_security_ja.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/message_notice_error_execute_check_security_ja.yaml
        aws s3 cp ./setting/check/notify/mail/message_notice_error_execute_check_security_en.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/message_notice_error_execute_check_security_en.yaml
        aws s3 cp ./setting/check/notify/mail/checkresult_slack_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/checkresult_slack_template_ja.tpl
        aws s3 cp ./setting/check/notify/mail/checkresult_slack_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/checkresult_slack_template_en.tpl
        aws s3 cp ./setting/check/notify/mail/insightwatch_user_invite_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_user_invite_template_en.tpl
        aws s3 cp ./setting/check/notify/mail/insightwatch_user_invite_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_user_invite_template_ja.tpl
        aws s3 cp ./setting/check/notify/mail/opswitch_user_invite_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_user_invite_template_en.tpl
        aws s3 cp ./setting/check/notify/mail/opswitch_user_invite_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_user_invite_template_ja.tpl
    fi
    ALLOW_ORIGIN='*'
    ;;
749077664194 ) 
   S3_SETTING_BUCKET='premembers-stg-setting'
   SENDMAIL_ERROR_NOTIFY_TOPIC='arn:aws:sns:ap-northeast-1:749077664194:Premembers-batch-error-notification' 
   SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC='arn:aws:sns:ap-northeast-1:749077664194:Premembers-Securitycheck-batch-error-notify'
   SECURITYCHECK_STATE_MACHINE_ARN='arn:aws:states:ap-northeast-1:749077664194:stateMachine:premembers-backend-SecurityCheckExec'
   SECURITYCHECK_EXECUTE_TOPIC='arn:aws:sns:ap-northeast-1:749077664194:Premembers-SecurityCheck-Execute-Topic'
   aws s3 cp ./setting/check/notify/mail/cis_checkresult_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/cis_checkresult_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/cis_checkresult_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/cis_checkresult_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/stg_config.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/config.yaml
   aws s3 cp ./setting/check/notify/mail/stg_insightwatch_apply_change_mail_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_apply_change_mail_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/stg_insightwatch_apply_change_mail_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_apply_change_mail_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/stg_opswitch_apply_change_mail_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_apply_change_mail_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/stg_opswitch_apply_change_mail_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_apply_change_mail_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/notice_error_execute_check_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/notice_error_execute_check_ja.tpl
   aws s3 cp ./setting/check/notify/mail/notice_error_execute_check_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/notice_error_execute_check_en.tpl
   aws s3 cp ./setting/check/notify/mail/message_notice_error_execute_check_security_ja.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/message_notice_error_execute_check_security_ja.yaml
   aws s3 cp ./setting/check/notify/mail/message_notice_error_execute_check_security_en.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/message_notice_error_execute_check_security_en.yaml
   aws s3 cp ./setting/check/notify/mail/checkresult_slack_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/checkresult_slack_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/checkresult_slack_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/checkresult_slack_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/insightwatch_user_invite_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_user_invite_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/insightwatch_user_invite_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_user_invite_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/opswitch_user_invite_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_user_invite_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/opswitch_user_invite_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_user_invite_template_ja.tpl
   ALLOW_ORIGIN='https://stg.insightwatch.io'
   ;;
267458812797 ) 
   S3_SETTING_BUCKET='premembers-prd-setting'
   SENDMAIL_ERROR_NOTIFY_TOPIC='arn:aws:sns:ap-northeast-1:267458812797:Premembers-prd-batch-error-notification' 
   SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC='arn:aws:sns:ap-northeast-1:267458812797:Premembers-Securitycheck-batch-error-notify'
   SECURITYCHECK_STATE_MACHINE_ARN='arn:aws:states:ap-northeast-1:267458812797:stateMachine:premembers-backend-SecurityCheckExec'
   SECURITYCHECK_EXECUTE_TOPIC='arn:aws:sns:ap-northeast-1:267458812797:Premembers-SecurityCheck-Execute-Topic'
   aws s3 cp ./setting/check/notify/mail/cis_checkresult_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/cis_checkresult_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/cis_checkresult_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/cis_checkresult_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/prd_config.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/config.yaml
   aws s3 cp ./setting/check/notify/mail/prd_insightwatch_apply_change_mail_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_apply_change_mail_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/prd_insightwatch_apply_change_mail_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_apply_change_mail_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/prd_opswitch_apply_change_mail_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_apply_change_mail_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/prd_opswitch_apply_change_mail_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_apply_change_mail_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/notice_error_execute_check_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/notice_error_execute_check_ja.tpl
   aws s3 cp ./setting/check/notify/mail/notice_error_execute_check_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/notice_error_execute_check_en.tpl
   aws s3 cp ./setting/check/notify/mail/message_notice_error_execute_check_security_ja.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/message_notice_error_execute_check_security_ja.yaml
   aws s3 cp ./setting/check/notify/mail/message_notice_error_execute_check_security_en.yaml s3://${S3_SETTING_BUCKET}/check/notify/mail/message_notice_error_execute_check_security_en.yaml
   aws s3 cp ./setting/check/notify/mail/checkresult_slack_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/checkresult_slack_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/checkresult_slack_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/checkresult_slack_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/insightwatch_user_invite_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_user_invite_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/insightwatch_user_invite_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/insightwatch_user_invite_template_ja.tpl
   aws s3 cp ./setting/check/notify/mail/opswitch_user_invite_template_en.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_user_invite_template_en.tpl
   aws s3 cp ./setting/check/notify/mail/opswitch_user_invite_template_ja.tpl s3://${S3_SETTING_BUCKET}/check/notify/mail/opswitch_user_invite_template_ja.tpl
   ALLOW_ORIGIN='https://insightwatch.io'
   ;;
esac
export STAGE=${STAGE}
export S3_REPORT_BUCKET=${S3_REPORT_BUCKET}
export S3_CHECK_BUCKET=${S3_CHECK_BUCKET}
export S3_BATCH_LOG_BUCKET=${S3_BATCH_LOG_BUCKET}
export SNS_ORGANIZATION_TOPIC=${SNS_ORGANIZATION_TOPIC}
export COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}
export SQS_ORGANIZATION_QUEUE=${SQS_ORGANIZATION_QUEUE}
export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}
export NUM_OF_PROJECT_ITEMS_PER_1TIME=${NUM_OF_PROJECT_ITEMS_PER_1TIME}
export S3_SETTING_BUCKET=${S3_SETTING_BUCKET}
export NOTIFY_CONFIG_CIS_RESULT_MAIL=${NOTIFY_CONFIG_CIS_RESULT_MAIL}
export SENDMAIL_ERROR_NOTIFY_TOPIC=${SENDMAIL_ERROR_NOTIFY_TOPIC}
export SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC=${SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC}
export ALLOW_ORIGIN=${ALLOW_ORIGIN}
export SECURITYCHECK_STATE_MACHINE_ARN=${SECURITYCHECK_STATE_MACHINE_ARN}
export SECURITYCHECK_EXECUTE_TOPIC=${SECURITYCHECK_EXECUTE_TOPIC}
yarn run deploy
