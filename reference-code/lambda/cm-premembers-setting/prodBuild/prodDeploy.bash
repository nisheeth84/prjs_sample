#!/bin/bash

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd `dirname $0` || exit 1
S3_BUCKET="premembers-prd-deploy-source-bucket"
S3_CFN_TEMPLATE_BUCKET="premembers-prd-cfn-template-bucket"
StackTemplateUrl="https://s3-ap-northeast-1.amazonaws.com/${S3_CFN_TEMPLATE_BUCKET}/CodePipeline/createCodePipelineProdBothRepository.yml"

if [ -e ./args.conf ]; then
    . ${SCRIPTDIR}/args.conf
fi

echo "アップロードするS3は${S3_BUCKET}です・"

if [ $# -ne  2 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには2個の引数が必要です。" 1>&2
  echo "$0 [GITHUB TAG NAME] [AWS CLI Profile]"
  exit 1
fi
Tag=$1
Profile=$2
echo "指定されたTagは $Tag です。"
echo "指定されたProfileは $Profile です。"
if [ -e  $SCRIPTDIR/cm-premembers-frontend ]; then
    echo "フロントエンドのディレクトリがあるので削除します"
    rm -rf $SCRIPTDIR/cm-premembers-frontend 
fi
echo "フロントエンドのコードを取得します"
git clone --depth 1 -b ${Tag} https://github.com/cm-aws-sol/cm-premembers-frontend.git
cd cm-premembers-frontend 
echo "ZIPを作成します"
zip -r cm-premembers-frontend-${Tag}.zip * ./.eslintrc ./.babelrc
echo "S3にアップロードします"
aws s3 cp ./cm-premembers-frontend-${Tag}.zip s3://${S3_BUCKET}/${Tag}/frontend/ --profile ${Profile}
cd ..
if [ -e  $SCRIPTDIR/cm-premembers-backend ]; then
    echo "APIのディレクトリがあるので削除します"
    rm -rf $SCRIPTDIR/cm-premembers-backend
fi
echo "APIのコードを取得します"
git clone --depth=1 -b ${Tag} https://github.com/cm-aws-sol/cm-premembers-backend.git
cd cm-premembers-backend 
echo "ZIPを作成します"
zip -r cm-premembers-backend-${Tag}.zip *
echo "S3にアップロードします"
aws s3 cp ./cm-premembers-backend-${Tag}.zip s3://${S3_BUCKET}/${Tag}/backend/ --profile ${Profile}
echo "Pipelineを構築するCloudFormationのテンプレートをアップロードします"
cd ${SCRIPTDIR}
aws s3 cp ../CloudFormation_template/createCodePipelineProdBothRepository.yml s3://${S3_CFN_TEMPLATE_BUCKET}/CodePipeline/createCodePipelineProdBothRepository.yml --profile ${Profile}
echo "Pipelineを構築するCloudFormationを実行します"
result=(`aws cloudformation list-stacks  --profile ${Profile} --stack-status-filter CREATE_COMPLETE ROLLBACK_COMPLETE UPDATE_COMPLETE UPDATE_ROLLBACK_COMPLETE | jq '[.StackSummaries[]][]|select(.StackName=="prod-premembers-pipeline")'`)
if [ -n "$result" ]; then
    echo "Stackが存在していたのでStackの更新を行います"
    aws cloudformation update-stack --stack-name prod-premembers-pipeline  --template-url ${StackTemplateUrl} --parameters ParameterKey=Tag,ParameterValue=${Tag} ParameterKey=SourceCodeBucket,ParameterValue=${S3_BUCKET} --tags Key=Version,Value=${Tag} --profile ${Profile}
    echo "Stackの更新完了を待ちます。"
    aws cloudformation wait stack-update-complete --stack-name prod-premembers-pipeline --profile ${Profile}
    echo "Stackの更新が完了しました。"
else
    echo "Stackが存在していないのでStackの作成を行います"
    aws cloudformation create-stack --stack-name prod-premembers-pipeline  --template-url ${StackTemplateUrl} --parameters ParameterKey=Tag,ParameterValue=${Tag} ParameterKey=SourceCodeBucket,ParameterValue=${S3_BUCKET} --tags Key=Version,Value=${Tag} --profile ${Profile}
fi

