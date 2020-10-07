package jp.co.softbrain.esales.tenants.service.impl;

import java.io.ByteArrayInputStream;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import jp.co.softbrain.esales.tenants.service.SettingAmazonS3EnvironmentService;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;

/**
 * Utility methods for initiate AmazonS3
 *
 * @author tongminhcuong
 */
@Service
public class SettingAmazonS3EnvironmentServiceImpl implements SettingAmazonS3EnvironmentService {

    private static final String SERVICE_DATA_PATH_S3_KEY = "service_data";

    private final Logger log = LoggerFactory.getLogger(SettingAmazonS3EnvironmentServiceImpl.class);

    /**
     * @see SettingAmazonS3EnvironmentService#createAmazonS3Folder(String, String, String)
     */
    @Override
    public CompletableFuture<Boolean> createAmazonS3Folder(String bucketName,
            String tenantFolderKey, String microServiceName) {
        // {bucket_name}/tenants/{tenant_name}/{micro_service_name}/service_data/
        String microServiceFolderKey = String.format(Locale.ENGLISH, "%s%s/%s/",
                tenantFolderKey, microServiceName, SERVICE_DATA_PATH_S3_KEY);

        boolean isCreatedMicroServiceFolder = S3CloudStorageClient
                .putObject(bucketName, microServiceFolderKey, new ByteArrayInputStream(new byte[0]));

        if (!isCreatedMicroServiceFolder) {
            log.info("\n\n\t===============\n\tCANNOT CREATE FOLDER {} IN AMAZONS3\n\t===============\n\n",
                    microServiceFolderKey);
            return CompletableFuture.completedFuture(false);
        }

        log.info("\n\n\t===============\n\tCREATED FOLDER {} IN AMAZONS3\n\t===============\n\n", microServiceFolderKey);
        return CompletableFuture.completedFuture(true);
    }
}
