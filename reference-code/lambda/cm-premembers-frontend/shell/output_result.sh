cd `dirname $0` || exit 1
. ./args.conf
if [[ $CLOUDFRONT_API_ENABLE == "true" ]]; then
    case $AWS_ACCOUNT_ID in
    267458812797 ) APIGATEWAY_ADDRESS=https://api.insightwatch.io ;;
    749077664194 ) APIGATEWAY_ADDRESS=https://api.stg.insightwatch.io ;;
    216054658829 ) APIGATEWAY_ADDRESS=https://api.dev.insightwatch.io ;;
    esac
fi
cat <<END > ./result.txt
APIGATEWAT_ADDRESS=${APIGATEWAY_ADDRESS}
COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}
COGNITO_CLIENT_ID=${COGNITO_CLIENT_ID}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}
S3_WEBSITE_BUCKET=${S3_WEBSITE_BUCKET}
GIT_HASH=$CODEBUILD_SOURCE_VERSION 
GIT_HASH_2=$CODEBUILD_RESOLVED_SOURCE_VERSION
END