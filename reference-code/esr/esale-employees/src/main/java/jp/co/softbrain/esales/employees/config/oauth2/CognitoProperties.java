package jp.co.softbrain.esales.employees.config.oauth2;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.employees.config.ConstantsEmployees;

@Component
@ConfigurationProperties(prefix = "cognito", ignoreUnknownFields = false)
public class CognitoProperties {

    private long userAwayTime = ConstantsEmployees.USER_AWAY_TIME;
    
    /**
     * client call back url
     */
    private String callBackUrl;

    private SignatureVerification signatureVerification = new SignatureVerification();
    
    /**
     * @return the userAwayTime
     */
    public long getUserAwayTime() {
        return userAwayTime;
    }

    /**
     * @param userAwayTime the userAwayTime to set
     */
    public void setUserAwayTime(long userAwayTime) {
        this.userAwayTime = userAwayTime;
    }

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
