package jp.co.softbrain.esales.commons.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "sns", ignoreUnknownFields = false)
public class SnsProperties {

    private String topicArn;

    private String platformApplicationArn;

    private Integer sessionTokenTimeout;

    public String getTopicArn() {
        return topicArn;
    }

    public void setTopicArn(String topicArn) {
        this.topicArn = topicArn;
    }

    public String getPlatformApplicationArn() {
        return platformApplicationArn;
    }

    public void setPlatformApplicationArn(String platformApplicationArn) {
        this.platformApplicationArn = platformApplicationArn;
    }

    public Integer getSessionTokenTimeout() {
        return sessionTokenTimeout;
    }

    public void setSessionTokenTimeout(Integer sessionTokenTimeout) {
        this.sessionTokenTimeout = sessionTokenTimeout;
    }
}
