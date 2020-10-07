#!/bin/bash
CURRENT_DIR=`pwd`
if [ -e ${CURRENT_DIR}/user_args.conf ]; then
    . ${CURRENT_DIR}/user_args.conf
fi
JAVA_PARAM='-Dfile.encoding=UTF-8'
#JAR_PATH='/Users/tagomasayuki/plantuml/plantuml.jar'
#TARGET_FILE=$1
TARGET_FILE='./UI/**pu'
java ${JAVA_PARAM} -jar ${PLANTUML_JAR} ${TARGET_FILE} -o ${CURRENT_DIR}/_out/UI

TARGET_FILE='./API/**pu'
java ${JAVA_PARAM} -jar ${PLANTUML_JAR} ${TARGET_FILE} -o ${CURRENT_DIR}/_out/API

TARGET_FILE='./BATCH/**pu'
java ${JAVA_PARAM} -jar ${PLANTUML_JAR} ${TARGET_FILE} -o ${CURRENT_DIR}/_out/BATCH

exit
