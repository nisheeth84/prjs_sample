FROM store/oracle/serverjre:8
ADD ./build/libs/aws-resource-report-generator.jar aws-resource-report-generator.jar
CMD ["java", "-jar", "./aws-resource-report-generator.jar", "--jobCode=SAMPLE_JOB", "--reportId=X", "-logId=X"]
