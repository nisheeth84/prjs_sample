cd `dirname $0` || exit 1
. ./args.conf
cd ..
if [ $AWS_ACCOUNT_ID = "216054658829" ] ; then
    rm ./yarn.lock
fi
