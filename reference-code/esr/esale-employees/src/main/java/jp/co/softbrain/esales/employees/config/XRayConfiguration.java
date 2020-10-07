package jp.co.softbrain.esales.employees.config;

import javax.servlet.Filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.xray.javax.servlet.AWSXRayServletFilter;

import jp.co.softbrain.esales.employees.interceptor.XRayInspector;

@Configuration
@ConditionalOnExpression(value = "${XRAY_ENABLED:false}")
public class XRayConfiguration {

    @Value("${spring.application.name}")
    private String appName = "Employees";

    @Bean
    public Filter tracingFilter() {
        return new AWSXRayServletFilter(appName);
    }

    @Bean
    public XRayInspector xRayInspector() {
        return new XRayInspector();
    }
}
