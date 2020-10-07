#!/bin/bash -eu

if [ $# -ne  3 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには3個の引数が必要です。" 1>&2
  echo "$0 [UserPoolId][User EmailAddress] [AWS CLI Profile]"
  exit 1
fi
userPoolId=$1
email=$2
profile=$3
echo "操作対象のUserPoolは $userPoolId です。"
echo "無効対象のユーザーのメールアドレスは $email です。"
echo "指定されたProfileは $profile です。"
userName=$(aws cognito-idp list-users --user-pool-id $userPoolId --filter "email = \"$email\"" --profile $profile  | jq -r '.[][] | select(.UserStatus=="CONFIRMED").Username')
aws cognito-idp admin-set-user-mfa-preference --user-pool-id $userPoolId --username $userName --cli-input-json file://disableMFA.json --profile $profile
