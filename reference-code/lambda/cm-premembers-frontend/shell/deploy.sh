cd `dirname $0` || exit 1
. ./args.conf
cd ..
export S3_WEBSITE_BUCKET=$S3_WEBSITE_BUCKET
case $AWS_ACCOUNT_ID in
216054658829 ) DISTLIBUTION_ID=ER8M78S5MWCQH ;;
749077664194 ) DISTLIBUTION_ID=E2EFD3JXYP6E09 ;;
267458812797 ) DISTLIBUTION_ID=E3JBUEHSMDLBT3 ;;
esac
aws configure set preview.cloudfront true
if [ $BRANCH = "develop" -o $BRANCH = "master"  -o $BRANCH = "staging" ] ; then
    aws s3 sync ./public s3://$S3_WEBSITE_BUCKET/app/
    aws cloudfront create-invalidation --distribution-id $DISTLIBUTION_ID --paths '/app/*'
else
    aws s3 sync ./public s3://$S3_WEBSITE_BUCKET/$BRANCH
    aws cloudfront create-invalidation --distribution-id $DISTLIBUTION_ID --paths /$BRANCH/*
fi
