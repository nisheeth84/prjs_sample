package jp.co.softbrain.esales.tenants.tenant.client.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/**
 * Others database configuration properties which are read from the application file
 */
@Slf4j
@Configuration
@ConfigurationProperties("multitenant.app.tenant.datasource")
@Data
public class DatabaseOtherServiceConfigProperties implements InitializingBean {

    /** master Url */
    private String masterUrl;

    /** database username */
    private String username;

    /** database password */
    private String password;

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("\n==============================\nPROPERTIES = {}\n==============================", this);
    }
}
