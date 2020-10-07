#!/bin/bash -eu
export AWS_DEFAULT_REGION='us-west-2'

if [ $# -ne  2 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [Domain(root)] [AWS CLI Profile] [VerificationToken]"
  exit 1
fi
domain=$1
profile=$2
echo "指定されたDomainは $domain です。"
echo "指定されたProfileは $profile です。"
dmarcRecord="v=DMARC1; p=none"
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
  --change-batch "$(jo -p Comment="test" Changes=$(jo -a $(jo Action=UPSERT ResourceRecordSet=$(jo Name=_dmarc.$domain. Type=TXT TTL=300 ResourceRecords=$(jo -a $(jo Value=dummy))))) | sed -E 's/dummy/\\"v=DMARC1; p=none\\"/')" \