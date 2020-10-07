#!/bin/bash -eu
FRONTEND_CODEPIPELINE=cm-premembers-frontend-develop-Pipeline
BACKEND_CODEPIPELINE=cm-premembers-backend-develop-Pipeline
SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ -e ./args.conf ]; then
    . ${SCRIPTDIR}/args.conf
fi

if [ $# -ne  4 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには4個の引数が必要です。" 1>&2
  echo "$0 [Frontend Dir] [Backend Dir] [RELEASE Version] [AWS CLI Profile]"
  exit 1
fi

FrontendDir=$1
BackendDir=$2
ReleaseVersion=$3
Profile=$4
echo "指定されたFrontendDirは $FrontendDir です。"
echo "指定されたBackendDirは $BackendDir です。"
echo "指定されたReleaseVersionは $ReleaseVersion です。"
echo "指定されたProfileは $Profile です。"

echo "Releaseブランチを作成します"
cd ${SCRIPTDIR}/${FrontendDir} && git flow release start ${ReleaseVersion}
cd ${SCRIPTDIR}/${BackendDir} && git flow release start ${ReleaseVersion}
echo "Releaseブランチを作成しました"

echo "フロントエンドのyarn.lockの取得を行います。"
cd ${SCRIPTDIR}
build_id="$(aws codepipeline get-pipeline-state --name ${FRONTEND_CODEPIPELINE} --query 'stageStates[?stageName==`Build`]' --profile=${Profile} | jq -r '.[0].actionStates[0].latestExecution.externalExecutionId')"
build=$(aws codebuild batch-get-builds --ids "${build_id}" --query "builds[0]" --profile=${Profile})
mkdir -p "./artifacts"
artifact_location=$(echo $build | jq -r '.artifacts.location')
s3_path=$(echo $artifact_location | cut -d : -f 6)
aws s3 cp "s3://${s3_path}" "./artifacts/" --profile=${Profile}
unzip artifacts/* "*.lock"
rm artifacts/*
mv ./yarn.lock ${SCRIPTDIR}/${FrontendDir}/
cd ${SCRIPTDIR}/${FrontendDir}/
git add ./yarn.lock
git commit -m "update yarn.lock"
cd ${SCRIPTDIR}

echo "APIのyarn.lockの取得を行います。"
build_id="$(aws codepipeline get-pipeline-state --name ${BACKEND_CODEPIPELINE} --query 'stageStates[?stageName==`Build`]' --profile=${Profile} | jq -r '.[0].actionStates[0].latestExecution.externalExecutionId')"
build=$(aws codebuild batch-get-builds --ids "${build_id}" --query "builds[0]" --profile=${Profile})
mkdir -p "./artifacts"
artifact_location=$(echo $build | jq -r '.artifacts.location')
s3_path=$(echo $artifact_location | cut -d : -f 6)
aws s3 cp "s3://${s3_path}" "./artifacts/" --profile=${Profile}
unzip artifacts/* "*.lock"
rm artifacts/*
mv ./yarn.lock ${SCRIPTDIR}/${BackendDir}/
cd ${SCRIPTDIR}/${BackendDir}/
git add ./yarn.lock
git commit -m "update yarn.lock"
cd ${SCRIPTDIR}
