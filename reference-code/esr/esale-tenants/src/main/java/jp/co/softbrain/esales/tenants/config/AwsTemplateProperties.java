package jp.co.softbrain.esales.tenants.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Properties specific to config aws database.
 *
 * @author nguyenvietloi
 */
@Slf4j
@Data
@Configuration
@ConfigurationProperties(prefix = "aws.template", ignoreUnknownFields = false)
public class AwsTemplateProperties implements InitializingBean {

    private String dbPath;

    private String esPath;

    private String migrationDataPath;

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("\n==============================\nPROPERTIES = {}\n==============================", this);
    }
}
