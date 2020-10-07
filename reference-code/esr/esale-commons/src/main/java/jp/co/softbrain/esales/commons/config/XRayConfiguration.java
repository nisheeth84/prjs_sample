package jp.co.softbrain.esales.commons.config;

import javax.servlet.Filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.xray.javax.servlet.AWSXRayServletFilter;

import jp.co.softbrain.esales.commons.interceptor.XRayInspector;

@Configuration
@ConditionalOnExpression(value = "${XRAY_ENABLED:false}")
public class XRayConfiguration {

    @Value("${spring.application.name}")
    private String appName = "Commons";

    @Bean
    public Filter tracingFilter() {
        return new AWSXRayServletFilter(appName);
    }

    @Bean
    public XRayInspector xRayInspector() {
        return new XRayInspector();
    }
}
