package jp.co.softbrain.esales.tenants.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Properties specific to App.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@Slf4j
@Data
@Configuration
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties implements InitializingBean {

    private String uploadBucket;
    private int expiredSeconds = 1000;

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("\n==============================\nPROPERTIES = {}\n==============================", this);
    }
}
