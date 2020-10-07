package jp.classmethod.premembers.check.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class DynamoDBConfig {
    @Value("${dynamodb.endpoint}")
    private String endpoint;
    @Value("${dynamodb.region}")
    private String region;
}
