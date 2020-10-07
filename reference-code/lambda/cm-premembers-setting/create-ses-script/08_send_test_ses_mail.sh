#!/bin/bash
export AWS_DEFAULT_REGION='us-west-2'
if [ $# -ne  3 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには3個の引数が必要です。" 1>&2
  echo "$0 [Domain] [email address] [AWS CLI Profile]"
  exit 1
fi
domain=$1
email=$2
profile=$3
echo "指定されたDomainは $domain です。"
echo "指定されたEmailは $email です。"
echo "指定されたProfileは $profile です。"
aws ses send-email \
  --from testSend_1@$domain \
  --to $email \
  --subject "test send 1" \
  --text "test messsage 1" \
  --profile $profile
aws ses send-email \
  --from testSend_japanese@$domain \
  --to $email \
  --subject テスト送信です \
  --text テスト用のEmail送信です。正しくみえていますか？  \
  --profile $profile