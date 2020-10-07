#!/bin/bash

REPODIR=$(cd $(dirname $0)/..;pwd)
while read -u 3 line 
do
    echo "${line} テーブルを削除します" 
    aws dynamodb delete-table --table-name ${line} --endpoint-url http://localhost:8000
done 3< dynamodb_table.lst
