package jp.co.softbrain.esales.tenants.config.oauth2;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "cognito", ignoreUnknownFields = false)
public class CognitoProperties {

    /**
     * client call back url
     */
    private String callBackUrl;

    private SignatureVerification signatureVerification = new SignatureVerification();

    @Data
    public static class SignatureVerification {
        private String region;
    }
}
