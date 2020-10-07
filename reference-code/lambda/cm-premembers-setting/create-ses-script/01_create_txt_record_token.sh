#!/bin/bash

if [ $# -ne  2 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [verify a domain] [AWS CLI Profile]"
  exit 1
fi
domain=$1
profile=$2
echo "指定されたDomainは $domain です。"
echo "指定されたProfileは $profile です。"
AWS_DEFAULT_REGION='us-west-2'
# ドメインの検証用コードの払い出し
aws ses verify-domain-identity --domain ${domain} --profile ${profile} --region ${AWS_DEFAULT_REGION}
