#!/bin/bash -eu
export AWS_DEFAULT_REGION='us-west-2'

if [ $# -ne  3 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには3個の引数が必要です。" 1>&2
  echo "$0 [verify a domain ] [AWS CLI Profile] [VerificationToken]"
  exit 1
fi
domain=$1
profile=$2
verificationToken=$3
echo "指定されたDomainは $domain です。"
echo "指定されたProfileは $profile です。"
echo "指定されたVerificationTokenは $verificationToken です。"
# TXTレコードの作成
hostedZoneId=$(
aws route53 list-hosted-zones \
      --query "HostedZones[?Name==\`${domain}.\`].Id" \
      --output text \
      --profile ${profile} \
    | sed -E 's@/hostedzone/@@')
aws route53 change-resource-record-sets \
  --hosted-zone-id ${hostedZoneId} \
  --profile ${profile} \
  --change-batch "$(jo Comment="test" Changes=$(jo -a $(jo Action=UPSERT ResourceRecordSet=$(jo Name=_amazonses.$domain. Type=TXT TTL=1800 ResourceRecords=$(jo -a $(jo Value=${verificationToken}))))) \
    | sed -E -e 's@("Value":)@\1"\\@' -e 's@(=)@\1\\"@')"