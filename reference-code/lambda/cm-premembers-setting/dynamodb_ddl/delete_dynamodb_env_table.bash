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
    read -p  "${TablePrefix}_${line} テーブルを削除しますか? (Yes  or No ) :" ANSWER
    case $ANSWER in
        "Y" | "y" | "yes" | "Yes" | "YES" ) 
            echo "${TablePrefix}_${line} テーブルを削除します" 
            aws dynamodb delete-table --table-name ${TablePrefix}_${line}  --profile $Profile;;
        * ) echo "${TablePrefix}_${line} テーブルは削除しません";;
    esac
done 3< dynamodb_table.lst

