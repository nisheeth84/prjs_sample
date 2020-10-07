#!/bin/bash
export AWS_DEFAULT_REGION='us-west-2'
if [ $# -ne  2 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [email address] [AWS CLI Profile]"
  exit 1
fi
email=$1
profile=$2
echo "指定されたEmailは $email です。"
echo "指定されたProfileは $profile です。"
aws ses verify-email-identity  --email-address $email --profile $profile
echo "$email に承認メールがきているので承認して下さい"
aws ses wait identity-exists --identities $email --profile $profile
echo "承認されました"
