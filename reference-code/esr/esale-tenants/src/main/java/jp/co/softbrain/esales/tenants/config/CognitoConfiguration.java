package jp.co.softbrain.esales.tenants.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;

/**
 * Configuration for Cognito
 *
 * @author tongminhcuong
 */
@Configuration
@RequiredArgsConstructor
public class CognitoConfiguration {

    private final AwsQuickSightConfigProperties awsQuickSightConfigProperties;

    /**
     * Register bean for {@link CognitoIdentityProviderClient}
     *
     * @return {@link CognitoIdentityProviderClient}
     */
    @Bean
    public CognitoIdentityProviderClient mIdentityProvider() {
        DefaultCredentialsProvider defaultCredentialsProvider = DefaultCredentialsProvider.create();

        return CognitoIdentityProviderClient.builder()
                .credentialsProvider(defaultCredentialsProvider)
                .region(awsQuickSightConfigProperties.getAwsRegion())
                .build();
    }
}
