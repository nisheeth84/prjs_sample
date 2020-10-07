#!/bin/bash

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ $# -ne 2 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [Table Prefix] [AWS CLI Profile]"
  exit 1
fi
TablePrefix=$1
Profile=$2
echo "指定されたTableのPrfixは $TablePrefix です。"
echo "指定されたProfileは $Profile です。"


while read -u 3 line 
do
    read -p  "$line テーブルを作成しますか? (Yes  or No ) :" ANSWER
    case $ANSWER in
        "Y" | "y" | "yes" | "Yes" | "YES" ) 
            echo "${TablePrefix}_${line} テーブルを作成します" 
            aws dynamodb create-table --table-name ${TablePrefix}_${line} --cli-input-json file://$SCRIPTDIR/$line.json --profile $Profile
            if [ -e  $SCRIPTDIR/${line}_TTL.json ]; then
                echo "${TablePrefix}_${line} テーブルにTTLを設定します" 
                echo "Table作成のため少し待ちます。"
                aws dynamodb wait table-exists --table-name ${TablePrefix}_${line} --profile $Profile
                aws dynamodb update-time-to-live --table-name ${TablePrefix}_${line} --cli-input-json file://$SCRIPTDIR/${line}_ttl.json --profile $Profile
            fi
            ;;
        * ) echo "${TablePrefix}_${line} テーブルは作成しません";;
    esac
done 3< dynamodb_table.lst