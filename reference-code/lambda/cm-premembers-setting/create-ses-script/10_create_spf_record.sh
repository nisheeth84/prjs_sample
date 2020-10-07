#!/bin/bash -eu
export AWS_DEFAULT_REGION='us-west-2'


if [ $# -ne  3 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [ Domain(root) ] [ SubDomain ][AWS CLI Profile]"
  exit 1
fi
subDomain=$1
domain=$2
profile=$3
echo "指定されたSubDomainは $subDomain です。"
echo "指定されたDomain(Root)は $domain です。"
echo "指定されたProfileは $profile です。"
hosted_zone_id="$(
  aws route53 list-hosted-zones \
    --query "HostedZones[?Name==\`${domain}.\`].Id" \
    --output text \
    --profile ${profile} \
  | sed -E 's@/hostedzone/@@')";
# MXレコードの作成
aws route53 change-resource-record-sets \
  --hosted-zone-id $hosted_zone_id \
  --change-batch "$(jo -p Comment="test" Changes=$(jo -a $(jo Action=UPSERT ResourceRecordSet=$(jo Name=$subDomain.$domain. Type=MX TTL=300 ResourceRecords=$(jo -a $(jo Value=10_feedback-smtp.us-west-2.amazonses.com))))) | sed -E 's/10_/10 /')" \
  --profile ${profile};

# SPFレコードの作成
aws route53 change-resource-record-sets \
  --hosted-zone-id $hosted_zone_id \
  --change-batch "$(jo -p Comment="test" Changes=$(jo -a $(jo Action=UPSERT ResourceRecordSet=$(jo Name=$subDomain.$domain. Type=TXT TTL=300 ResourceRecords=$(jo -a $(jo Value=dummy))))) | sed -E 's/dummy/\\"v=spf1 include:amazonses.com ~all\\"/')" \
  --profile ${profile};