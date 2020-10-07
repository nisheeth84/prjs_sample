#!/bin/bash -eu
export AWS_DEFAULT_REGION='us-west-2'

if [ $# -ne  2 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [verify a domain] [AWS CLI Profile] "
  exit 1
fi
domain=$1
profile=$2
echo "指定されたDomainは $domain です。"
echo "指定されたProfileは $profile です。"
# DKIMレコードの作成
hosted_zone_id="$(
  aws route53 list-hosted-zones \
    --query "HostedZones[?Name==\`${domain}.\`].Id" \
    --output text \
    --profile ${profile} \
  | sed -E 's@/hostedzone/@@')";
  for dkim_token in $(
    aws ses get-identity-dkim-attributes \
      --identities $domain \
      --query 'DkimAttributes.*.DkimTokens' \
      --profile ${profile} \
      --output text); do \
    aws route53 change-resource-record-sets \
      --hosted-zone-id $hosted_zone_id \
      --change-batch "$(jo Comment="test" Changes=$(jo -a $(jo Action=UPSERT ResourceRecordSet=$(jo Name=$dkim_token._domainkey.$domain. Type=CNAME TTL=1800 ResourceRecords=$(jo -a $(jo Value=$dkim_token.dkim.amazonses.com))))))" \
      --profile ${profile};
  done