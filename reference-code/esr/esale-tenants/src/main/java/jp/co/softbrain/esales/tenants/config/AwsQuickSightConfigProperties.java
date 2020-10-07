package jp.co.softbrain.esales.tenants.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;
import software.amazon.awssdk.regions.Region;

/**
 * SettingQuickSightConfigurationProperties
 *
 * @author tongminhcuong
 */
@Slf4j
@Data
@Configuration
@ConfigurationProperties(prefix = "aws.quick-sight", ignoreUnknownFields = false)
public class AwsQuickSightConfigProperties implements InitializingBean {

    private Region awsRegion;

    private String awsAccountId;

    private String awsAdminArn;

    private String vpcDatabaseConnection;

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("\n==============================\nPROPERTIES = {}\n==============================", this);
    }
}
