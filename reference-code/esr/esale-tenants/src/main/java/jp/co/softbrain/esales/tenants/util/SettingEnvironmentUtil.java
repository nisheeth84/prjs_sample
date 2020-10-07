package jp.co.softbrain.esales.tenants.util;

import static jp.co.softbrain.esales.tenants.service.impl.SettingEnvironmentServiceImpl.UNMADE_TENANT_CREATION_STATUS;

import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.elasticsearch.client.indices.CreateIndexResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.iterable.S3Objects;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.util.CollectionUtils;
import com.amazonaws.util.StringUtils;

import jp.co.softbrain.esales.tenants.config.ApplicationProperties;
import jp.co.softbrain.esales.tenants.repository.MTemplatesRepository;
import jp.co.softbrain.esales.tenants.service.SettingAmazonS3EnvironmentService;
import jp.co.softbrain.esales.tenants.service.SettingDatabaseEnvironmentService;
import jp.co.softbrain.esales.tenants.service.SettingElasticsearchEnvironmentService;
import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.dto.MTemplateInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateS3StorageResult;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateSchemaResult;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.SettingEnvironmentResult;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;

/**
 * SettingEnvironmentUtil
 *
 * @author tongminhcuong
 */
@Component
public class SettingEnvironmentUtil {

    private static final String TENANTS_PATH_S3_KEY = "tenants";

    private final Logger log = LoggerFactory.getLogger(SettingEnvironmentUtil.class);

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private MTemplatesRepository mTemplatesRepository;

    @Autowired
    private SettingAmazonS3EnvironmentService settingAmazonS3EnvironmentService;

    @Autowired
    private SettingDatabaseEnvironmentService settingDatabaseEnvironmentService;

    @Autowired
    private SettingElasticsearchEnvironmentService settingElasticsearchEnvironmentService;

    @Autowired
    private ApplicationProperties applicationProperties;

    /**
     * Create map after get data from m_templates table
     *
     * @param mIndustryId mIndustryId
     * @param microServiceNameList list of master service
     * @return map: micro_service_name -> master_template
     */
    public Map<String, MTemplateInfoDTO> makeMicroServiceNameAndTemplatesMap(
            Long mIndustryId, List<String> microServiceNameList) {

        List<MTemplateInfoDTO> masterTemplateList = mTemplatesRepository
                .getMasterTemplates(mIndustryId, microServiceNameList);

        if (masterTemplateList.stream().anyMatch(templateInfo -> StringUtils.isNullOrEmpty(templateInfo.getFileName()))) {
            log.error("Create database failed. Existed template file name is null or empty. {}", masterTemplateList);
            throw new IllegalStateException("Create database failed. Existed template file name is null or empty.");
        }

        // Create map: micro_service_name -> master_template
        return masterTemplateList.stream()
                .collect(Collectors.toMap(
                        /* keyMapper */
                        MTemplateInfoDTO::getMicroServiceName,
                        /* valueMapper */
                        Function.identity()));
    }

    /**
     * Execute initiate database for tenant (multiple thread)
     *
     * @param tenantName The name of tenant
     * @param microServiceNameAndTemplatesMap map: micro_service_name -> master_template
     * @param masterSchemaName masterSchemaName
     * @param industryTypeName industryTypeName
     * @return list of {@link CreateSchemaResult}
     */
    public List<CreateSchemaResult> executeInitiateDatabase(String tenantName,
            Map<String, MTemplateInfoDTO> microServiceNameAndTemplatesMap, String industryTypeName, String masterSchemaName) {

        log.info("Micro service template: {}", microServiceNameAndTemplatesMap);

        @SuppressWarnings("unchecked")
        CompletableFuture<CreateSchemaResult>[] completableFutureJobs = microServiceNameAndTemplatesMap.entrySet().stream()
                .map(entry -> {
                    String microServiceName = entry.getKey();
                    MTemplateInfoDTO masterTemplate = entry.getValue();
                    return settingDatabaseEnvironmentService.initiateDatabase(industryTypeName, microServiceName, tenantName,
                            masterTemplate, masterSchemaName);
                }).toArray(CompletableFuture[]::new);

        return runJobWithMultipleThread(completableFutureJobs);
    }

    /**
     * Create folders in AmazonS3 for tenant and micro services (multiple thread)
     *
     * @param bucketName The name of bucket
     * @param tenantName The name of Tenant target
     * @param microServiceNameList List of micro service name
     * @return {@link CreateS3StorageResult} ~ (true if success, otherwise return false)
     */
    public CreateS3StorageResult initiateStorageAmazonS3(String bucketName,
            String tenantName, List<String> microServiceNameList) {

        // create folder "{bucket_name}/tenants/{tenant_name}/"
        String tenantFolderKey = String.format(Locale.ENGLISH, "%s/%s/", TENANTS_PATH_S3_KEY, tenantName);

        boolean isCreatedTenantFolder = S3CloudStorageClient.putObject(bucketName, tenantFolderKey,
                new ByteArrayInputStream(new byte[0]));

        if (isCreatedTenantFolder) {
            log.info("\n\n\t===============\n\tCREATED FOLDER {} IN AMAZONS3\n\t===============\n\n", tenantFolderKey);

            // create folder for each micro service
            // {bucket_name}/tenants/{tenant_name}/{micro_service_name}/service_data/
            @SuppressWarnings("unchecked")
            CompletableFuture<Boolean>[] completableFutureJobs = microServiceNameList.stream()
                    .map(microServiceName -> settingAmazonS3EnvironmentService.createAmazonS3Folder(bucketName,
                            tenantFolderKey, microServiceName))
                    .toArray(CompletableFuture[]::new);

            List<Boolean> result = runJobWithMultipleThread(completableFutureJobs);
            boolean isSuccessfully = result.stream().allMatch(Boolean::booleanValue);
            return new CreateS3StorageResult(tenantFolderKey, isSuccessfully);
        }

        return new CreateS3StorageResult(null, false);
    }

    /**
     * Execute rollback database and delete folder AmazonS3 if error occurred
     *
     * @param tenantId tenantId
     * @param settingEnvironmentResult settingEnvironmentResult
     */
    public void rollbackWhenErrorOccurred(Long tenantId, SettingEnvironmentResult settingEnvironmentResult) {
        // Update tenant.creation_status to 1 (未作成)
        tenantService.updateCreationStatus(tenantId, UNMADE_TENANT_CREATION_STATUS);

        // 10.1 Delete serviceName of Elasticsearch
        if (settingEnvironmentResult.getCreateElasticsearchIndexResult() != null) {
            try {
                log.info("\n\n\t===============\n\tROLLBACK CREATE ELASTICSEARCH INDEX\n\t===============\n\n");
                settingEnvironmentResult.getCreateElasticsearchIndexResult().getCreateIndexResponses().stream()
                        .map(CreateIndexResponse::index)
                        .forEach(settingElasticsearchEnvironmentService::deleteElasticsearchIndex);

            } catch (Exception e) {
                log.error("Rollback failed. Cannot delete Elasticsearch index. Message: {}", e.getMessage(), e);
            }
        }

        // 10.2 Delete AmazonS3 folder
        CreateS3StorageResult createS3StorageResult = settingEnvironmentResult.getCreateS3StorageResult();
        if (createS3StorageResult != null && createS3StorageResult.getRootKey() != null) {
            try {
                log.info("\n\n\t===============\n\tROLLBACK CREATE STORAGE AMAZONS3\n\t===============\n\n");
                String bucketName = applicationProperties.getUploadBucket();
                S3Objects objects = S3Objects.withPrefix(s3Client, bucketName, createS3StorageResult.getRootKey());
                for (S3ObjectSummary summary : objects) {
                    s3Client.deleteObject(bucketName, summary.getKey());
                    log.info("\n\n\t===============\n\tDELETED S3 FOLDER {}\n\t===============\n\n", summary.getKey());
                }
            } catch (Exception e) {
                log.error("Rollback failed. Cannot delete S3 object. Message: {}", e.getMessage(), e);
            }
        }

        // 10.3 Delete Schema
        if (!CollectionUtils.isNullOrEmpty(settingEnvironmentResult.getCreateSchemaResultList())) {
            try {
                log.info("\n\n\t===============\n\tROLLBACK CREATE DATABASE\n\t===============\n\n");
                executeDropSchema(settingEnvironmentResult.getCreateSchemaResultList());
            } catch (Exception e) {
                log.error("Rollback failed. Cannot drop database. Message: {}", e.getMessage(), e);
            }
        }
    }

    /**
     * Execute drop schema to rollback (multiple thread)
     *
     * @param createSchemaResultList List of {@link CreateSchemaResult} that are created schemas
     */
    private void executeDropSchema(List<CreateSchemaResult> createSchemaResultList) {
        @SuppressWarnings("unchecked")
        CompletableFuture<String>[] completableFutureJobs = createSchemaResultList.stream()
                .map(settingDatabaseEnvironmentService::dropSchema)
                .toArray(CompletableFuture[]::new);

        List<String> result = runJobWithMultipleThread(completableFutureJobs);

        // log
        result.forEach(msg -> log.info("\n\n\t===============\n\t{}\n\t===============\n\n", msg));
    }

    /**
     * Execute job (multiple thread)
     *
     * @param completableFutures array of function that is job process
     * @param <T> result type of job process
     */
    public <T> List<T> runJobWithMultipleThread(CompletableFuture<T>[] completableFutures) {
        CompletableFuture<Void> allFutures = CompletableFuture.allOf(completableFutures);

        CompletableFuture<List<T>> allCompletableFuture = allFutures.thenApply(future -> Arrays
                .stream(completableFutures).map(CompletableFuture::join).collect(Collectors.toList()));

        try {
            return allCompletableFuture.get();
        } catch (CancellationException | ExecutionException e) {
            log.error("Existed job is not completed!!!");
        } catch (InterruptedException e) {
            log.error("Error occurred when executed multiple job!!!");
            Thread.currentThread().interrupt();
        }

        return Collections.emptyList();
    }
}
