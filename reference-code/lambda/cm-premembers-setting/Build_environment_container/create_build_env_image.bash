
#!/bin/bash
SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ -e ./args.conf ]; then
    . ${SCRIPTDIR}/args.conf
fi
if [ $# -ne  3 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには3個の引数が必要です。" 1>&2
  echo "$0 [Frontend Dir] [Backend Dir] [AWS CLI Profile]"
  exit 1
fi
FrontendDir=$1
BackendDir=$2
Profile=$3
echo "指定されたFrontendDirは $FrontendDir です。"
echo "指定されたBackendDirは $BackendDir です。"
echo "指定されたProfileは $Profile です。"

echo "packge.jsonを取得します(フロントエンド)"
cp ${SCRIPTDIR}/${FrontendDir}/package.json ./frontend-package.json
echo "packge.jsonを取得します(API)"
cp ${SCRIPTDIR}/${BackendDir}/package.json ./backend-package.json

echo "構築したイメージを配置します。"
$(aws ecr get-login --no-include-email --profile ${Profile})
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text --profile ${Profile})
REPOSITORY_NAME="premembers_backend_builder"
if [ $AWS_ACCOUNT_ID -eq "267458812797" ]; then
  REPOSITORY_NAME="premembers_builder"
fi
REPOSITORY_URI=${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/${REPOSITORY_NAME}
IMAGE_TAG=${RELEASE_TAG:-$(git describe --tags)}
docker build -t ${REPOSITORY_URI}:latest .
docker tag ${REPOSITORY_URI}:latest ${REPOSITORY_URI}:${IMAGE_TAG}
docker push ${REPOSITORY_URI}:${IMAGE_TAG}
docker push ${REPOSITORY_URI}:latest
