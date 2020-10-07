package jp.co.softbrain.esales.customers.config.oauth2;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "cognito", ignoreUnknownFields = false)
public class CognitoProperties {
        
    /**
     * client call back url
     */
    private String callBackUrl;

    private SignatureVerification signatureVerification = new SignatureVerification();

    /**
     * @return the callBackUrl
     */
    public String getCallBackUrl() {
        return callBackUrl;
    }

    /**
     * @param callBackUrl the callBackUrl to set
     */
    public void setCallBackUrl(String callBackUrl) {
        this.callBackUrl = callBackUrl;
    }

    /**
     * @return the signatureVerification
     */
    public SignatureVerification getSignatureVerification() {
        return signatureVerification;
    }

    /**
     * @param signatureVerification the signatureVerification to set
     */
    public void setSignatureVerification(SignatureVerification signatureVerification) {
        this.signatureVerification = signatureVerification;
    }

    public static class SignatureVerification {
        
        private String region;
        
        /**
         * @return the region
         */
        public String getRegion() {
            return region;
        }
        /**
         * @param region the region to set
         */
        public void setRegion(String region) {
            this.region = region;
        }
    }
}
