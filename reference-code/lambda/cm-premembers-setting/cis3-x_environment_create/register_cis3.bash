#!/bin/bash
if [ $# -ne  2 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [TOPIC ARN] [AWS CLI Profile]"
  exit 1
fi
TopicArn=$1
Profile=$2
echo "指定されたSNS TOPIC ARNは $TopicArn です。"
echo "指定されたProfileは $Profile です。"
for i in `seq 1 14`
do
echo file://cis3.${i}.json metric filter create
aws logs put-metric-filter --cli-input-json file://cis3.${i}.json --profile ${Profile}
echo file://cis3.${i}-sns.json metric alarm create
aws cloudwatch put-metric-alarm --alarm-actions ${TopicArn}  --cli-input-json file://cis3.${i}-sns.json --profile ${Profile}
done