package jp.co.softbrain.esales.tenants.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.services.quicksight.QuickSightClient;

/**
 * AwsQuickSightConfiguration
 *
 * @author tongminhcuong
 */
@Configuration
@RequiredArgsConstructor
public class AwsConfiguration {

    private final AwsQuickSightConfigProperties awsQuickSightConfigProperties;

    /**
     * Register bean for {@link QuickSightClient}
     *
     * @return {@link QuickSightClient}
     */
    @Bean
    public QuickSightClient quickSightClient() {
        DefaultCredentialsProvider defaultCredentialsProvider = DefaultCredentialsProvider.create();

        return QuickSightClient.builder()
                .credentialsProvider(defaultCredentialsProvider)
                .region(awsQuickSightConfigProperties.getAwsRegion())
                .build();
    }

    /**
     * Register bean for {@link AmazonS3}
     *
     * @return {@link AmazonS3}
     */
    @Bean
    public AmazonS3 s3Client() {
        return AmazonS3ClientBuilder.standard()
                .build();
    }
}
