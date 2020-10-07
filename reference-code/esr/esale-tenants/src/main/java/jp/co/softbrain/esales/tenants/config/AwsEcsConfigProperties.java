package jp.co.softbrain.esales.tenants.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Properties specific to config aws ecs.
 *
 * @author phamhoainam
 */
@Slf4j
@Data
@Configuration
@ConfigurationProperties(prefix = "ecs", ignoreUnknownFields = false)
public class AwsEcsConfigProperties implements InitializingBean {

    private String cluster;
    private String batchTaskName;
    private String batchContainerName;
    private String vpcSubnet;
    private String vpcSecurityGroup;

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("\n==============================\nPROPERTIES = {}\n==============================", this);
    }
}
