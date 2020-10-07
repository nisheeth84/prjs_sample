package jp.co.softbrain.esales.commons.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.CreatePlatformEndpointRequest;
import com.amazonaws.services.sns.model.CreatePlatformEndpointResult;
import com.amazonaws.services.sns.model.DeleteEndpointRequest;
import com.amazonaws.services.sns.model.PublishRequest;

import jp.co.softbrain.esales.commons.config.SnsProperties;
import jp.co.softbrain.esales.commons.service.AmazonSNSPublisherService;

//@Service
public class AmazonSNSPublisherServiceImpl implements AmazonSNSPublisherService {
    private final Logger log = LoggerFactory.getLogger(AmazonSNSPublisherServiceImpl.class);

    private AmazonSNS amazonSNS;

    private final SnsProperties snsProperties;

//    @Autowired
    public AmazonSNSPublisherServiceImpl(BasicSessionCredentials sessionCredentials, SnsProperties snsProperties) {
        this.amazonSNS = AmazonSNSClientBuilder.standard().withRegion(Regions.AP_NORTHEAST_1)
                .withCredentials(new AWSStaticCredentialsProvider(sessionCredentials)).build();
        this.snsProperties = snsProperties;
    }

    @Override
    public void publish(String messageBody, String targetArn) {
        try {
            PublishRequest publishRequest = new PublishRequest();
            publishRequest.setTargetArn(targetArn);
            publishRequest.setMessage(messageBody);
            publishRequest.setMessageStructure("json");
            amazonSNS.publish(publishRequest);
        } catch (Exception ex) {
            log.error("Publish push notification Error", ex);
        }

    }

    @Override
    public String createEndpoint(String deviceToken) {
        try {
            CreatePlatformEndpointRequest createPlatformEndpointRequest = new CreatePlatformEndpointRequest()
                    .withPlatformApplicationArn(snsProperties.getPlatformApplicationArn()).withToken(deviceToken);
            CreatePlatformEndpointResult createPlatformEndpointResult = amazonSNS
                    .createPlatformEndpoint(createPlatformEndpointRequest);
            return createPlatformEndpointResult.getEndpointArn();
        } catch (Exception ex) {
            log.error("Create Endpoint Error", ex);
            return "";
        }
    }

    @Override
    public void deleteEndpoint(String endpointArn) {
        try {
            DeleteEndpointRequest deleteEndpointRequest = new DeleteEndpointRequest().withEndpointArn(endpointArn);
            amazonSNS.deleteEndpoint(deleteEndpointRequest);
        } catch (Exception ex) {
            log.error("Delete Endpoint Error", ex);
        }
    }
}
