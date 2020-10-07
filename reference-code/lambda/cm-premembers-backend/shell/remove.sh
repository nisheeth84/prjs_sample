#!/bin/bash
cd `dirname $0` || exit 1
. ./args.conf
cd ..
if [ -v STAGE ];then
    if [ ! -n "$STAGE" ] ; then
        STAGE=$BRANCH
    fi
else
  STAGE=$BRANCH
fi
export STAGE=${STAGE}
export S3_REPORT_BUCKET=${S3_REPORT_BUCKET}
export SNS_ORGANIZATION_TOPIC=${SNS_ORGANIZATION_TOPIC}
export COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}
export SQS_ORGANIZATION_QUEUE=${SQS_ORGANIZATION_QUEUE}
export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}
export NUM_OF_PROJECT_ITEMS_PER_1TIME=${NUM_OF_PROJECT_ITEMS_PER_1TIME}
yarn run remove
