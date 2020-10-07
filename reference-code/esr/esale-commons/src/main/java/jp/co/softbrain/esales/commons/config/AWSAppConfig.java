package jp.co.softbrain.esales.commons.config;

import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceClient;
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceClientBuilder;
import com.amazonaws.services.securitytoken.model.Credentials;
import com.amazonaws.services.securitytoken.model.GetSessionTokenRequest;
import com.amazonaws.services.securitytoken.model.GetSessionTokenResult;

@Configuration
public class AWSAppConfig {

    private final SnsProperties snsProperties;

    public AWSAppConfig(SnsProperties snsProperties) {
        this.snsProperties = snsProperties;
    }

//    @Bean(name = "sessionCredentials")
    public BasicSessionCredentials sessionCredentials() {

        AWSSecurityTokenServiceClient sts_client = (AWSSecurityTokenServiceClient) AWSSecurityTokenServiceClientBuilder
                .defaultClient();
        GetSessionTokenRequest session_token_request = new GetSessionTokenRequest();
        session_token_request.setDurationSeconds(snsProperties.getSessionTokenTimeout());
        GetSessionTokenResult session_token_result = sts_client.getSessionToken(session_token_request);
        Credentials session_creds = session_token_result.getCredentials();
        BasicSessionCredentials sessionCredentials = new BasicSessionCredentials(session_creds.getAccessKeyId(),
                session_creds.getSecretAccessKey(), session_creds.getSessionToken());
        return sessionCredentials;
    }
}
