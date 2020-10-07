#!/bin/bash
export AWS_DEFAULT_REGION='us-west-2'

if [ $# -ne  3 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには3個の引数が必要です。" 1>&2
  echo "$0 [ Domain(root) ] [ SubDomain ][AWS CLI Profile]"
  exit 1
fi
subDomain=$1
domain=$2
profile=$3
echo "指定されたSubDomainは $subDomain です。"
echo "指定されたDomain(Root)は $domain です。"
echo "指定されたProfileは $profile です。"
# カスタムMAIL FROMドメインの有効化
aws ses set-identity-mail-from-domain \
  --identity $domain \
  --mail-from-domain $subDomain.$domain \
  --profile ${profile} \
