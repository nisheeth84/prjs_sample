package jp.co.softbrain.esales.tenants.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/**
 * Properties specific to config aws lambda function.
 *
 * @author nguyenvietloi
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "lambda.function", ignoreUnknownFields = false)
public class AwsLambdaProperties {

    private String pgdump;

    private String preTokenGenArn;
}
