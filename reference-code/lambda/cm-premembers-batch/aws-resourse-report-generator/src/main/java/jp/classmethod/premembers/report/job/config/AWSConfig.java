package jp.classmethod.premembers.report.job.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class AWSConfig {
    @Value("${s3.report.bucket}")
    private String s3ReportBucket;
    @Value("${s3.batch.log.bucket}")
    private String s3BatchLogBucket;
    @Value("${s3.setting.bucket}")
    private String s3SettingBucket;
    @Value("${s3.endpoint}")
    private String s3Endpoint;
    @Value("${s3.region}")
    private String s3Region;
    @Value("${dynamodb.endpoint}")
    private String dynamodbEndpoint;
    @Value("${dynamodb.region}")
    private String dynamodbRegion;
}
