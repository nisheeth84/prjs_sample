package jp.co.softbrain.esales.tenants.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Include methods to interact with AmazonS3
 */
@XRayEnabled
public interface SettingAmazonS3EnvironmentService {

    /**
     * Create folder in AmazonS3
     *
     * @param bucketName The name of bucket
     * @param tenantFolderKey root folder
     * @param microServiceName name of micro service
     * @return true if success, otherwise return false
     */
    @Async
    CompletableFuture<Boolean> createAmazonS3Folder(String bucketName,
            String tenantFolderKey, String microServiceName);
}
