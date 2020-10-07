FROM openjdk:8-slim
ADD ./build/libs/aws-securitycheck-report-generator.jar aws-securitycheck-report-generator.jar
ADD ./src/main/resources/jasper/* /var/tmp/premembers/check/template/
ADD ./src/main/resources/jasper/img/* /var/tmp/premembers/check/template/img/
CMD ["java", "-jar", "./aws-securitycheck-report-generator.jar", "--checkHistoryId=X", "--logId=X"]
#RUN yum -y install ipa-gothic-fonts ipa-pgothic-fonts && yum clean all
