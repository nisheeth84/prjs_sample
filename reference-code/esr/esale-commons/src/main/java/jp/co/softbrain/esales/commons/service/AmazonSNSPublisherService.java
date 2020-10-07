package jp.co.softbrain.esales.commons.service;

public interface AmazonSNSPublisherService {
    void publish(String body, String targetArn);

    String createEndpoint(String deviceToken);

    void deleteEndpoint(String endpointArn);
}
