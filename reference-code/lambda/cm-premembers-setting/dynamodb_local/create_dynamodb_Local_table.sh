#!/bin/bash

REPODIR=$(cd $(dirname $0)/..;pwd)
while read -u 3 line 
do
    echo "${line} テーブルを作成します" 
    aws dynamodb create-table --cli-input-json file://$REPODIR/dynamodb_ddl/$line.json --endpoint-url http://localhost:8000
done 3< dynamodb_table.lst
