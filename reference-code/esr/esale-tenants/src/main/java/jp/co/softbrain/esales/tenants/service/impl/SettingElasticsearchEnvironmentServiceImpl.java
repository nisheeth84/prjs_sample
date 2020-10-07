package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.ACTIVITY_INDEX;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.BUSINESSCARD_INDEX;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.CUSTOMER_INDEX;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.EMPLOYEE_INDEX;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.PRODUCT_INDEX;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.SALE_INDEX;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.SCHEDULE_INDEX;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ElasticsearchIndexEnum.TIMELINE_INDEX;
import static jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils.BUCKET_NAME_INDEX;
import static jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils.S3_KEY_INDEX;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.elasticsearch.ElasticsearchStatusException;
import org.elasticsearch.action.ActionRequestValidationException;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.ValidationException;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.xcontent.XContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.google.common.collect.ImmutableList;
import com.google.common.io.ByteSource;

import jp.co.softbrain.esales.tenants.config.AwsTemplateProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.service.SettingElasticsearchEnvironmentService;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateElasticsearchIndexResult;
import jp.co.softbrain.esales.tenants.tenant.util.S3PathUtils;
import lombok.RequiredArgsConstructor;

/**
 * Utility methods for initiate elasticsearch index
 */
@Service
@RequiredArgsConstructor
public class SettingElasticsearchEnvironmentServiceImpl implements SettingElasticsearchEnvironmentService {

    private static final int NUMBER_OF_SHARDS = 2;

    private static final int NUMBER_OF_REPLICAS = 1;

    private static final String INDEX_FORMAT = "%s_%s";

    private static final String INIT_INDEX_ID = "0";

    private static final String INIT_INDEX_SOURCE_PATH_FORMAT = "initiate_%s";

    private static final List<String> TARGET_MICRO_SERVICES = ImmutableList.of(
            ConstantsTenants.EMPLOYEE_SERVICE_NAME,
            ConstantsTenants.SCHEDULE_SERVICE_NAME,
            ConstantsTenants.PRODUCT_SERVICE_NAME,
            ConstantsTenants.CUSTOMERS_SERVICE_NAME,
            ConstantsTenants.BUSINESSCARDS_SERVICE_NAME,
            ConstantsTenants.ACTIVITIES_SERVICE_NAME,
            ConstantsTenants.TIMELINES_SERVICE_NAME,
            ConstantsTenants.SALES_SERVICE_NAME);

    private static final String JSON_LINE_EXTENSION = ".jsonl";

    private static final String ERROR_MESSAGE = "Cannot create elasticsearch index. Index name = %s. Message: %s";

    private final Logger log = LoggerFactory.getLogger(SettingElasticsearchEnvironmentServiceImpl.class);

    private final AmazonS3 s3Client;

    private final RestHighLevelClient esClient;

    private final AwsTemplateProperties awsTemplateProperties;

    /**
     * @see SettingElasticsearchEnvironmentService#createElasticsearchIndex(String, List)
     */
    @Override
    public CreateElasticsearchIndexResult createElasticsearchIndex(String tenantName, List<String> microServiceNameList) {
        List<CreateIndexResponse> createIndexResponseList = new ArrayList<>();

        String[] s3KeyInfo = S3PathUtils.extractS3Path(awsTemplateProperties.getEsPath());
        String bucketName = s3KeyInfo[BUCKET_NAME_INDEX];

        for (String microServiceName : microServiceNameList) {
            if (!TARGET_MICRO_SERVICES.contains(microServiceName)) {
                continue;
            }

            String esTemplatePath = s3KeyInfo[S3_KEY_INDEX] + microServiceName + JSON_LINE_EXTENSION;
            String initIndexSourcePath = s3KeyInfo[S3_KEY_INDEX] +
                    String.format(INIT_INDEX_SOURCE_PATH_FORMAT, microServiceName) + JSON_LINE_EXTENSION;

            try {
                switch (microServiceName) {
                    case ConstantsTenants.EMPLOYEE_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, EMPLOYEE_INDEX.getSuffix()));
                        break;

                    case ConstantsTenants.SCHEDULE_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, SCHEDULE_INDEX.getSuffix()));
                        break;

                    case ConstantsTenants.PRODUCT_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, PRODUCT_INDEX.getSuffix()));
                        break;

                    case ConstantsTenants.BUSINESSCARDS_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, BUSINESSCARD_INDEX.getSuffix()));
                        break;

                    case ConstantsTenants.TIMELINES_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, TIMELINE_INDEX.getSuffix()));
                        break;

                    case ConstantsTenants.SALES_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, SALE_INDEX.getSuffix()));
                        break;

                    case ConstantsTenants.ACTIVITIES_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, ACTIVITY_INDEX.getSuffix()));
                        break;

                    case ConstantsTenants.CUSTOMERS_SERVICE_NAME:
                        createIndexResponseList.add(setupIndexElasticsearch(tenantName,
                                bucketName, esTemplatePath, initIndexSourcePath, CUSTOMER_INDEX.getSuffix()));
                        break;

                    default:
                        return new CreateElasticsearchIndexResult(false, createIndexResponseList,
                                "Create Elasticsearch index failed. Unknown micro service name \" + microServiceName");
                }
            } catch (IllegalStateException e) {
                return new CreateElasticsearchIndexResult(false, createIndexResponseList, e.getMessage());
            }
        }

        return new CreateElasticsearchIndexResult(true, createIndexResponseList, null /* errorMessage */);
    }

    /**
     * @see SettingElasticsearchEnvironmentService#deleteElasticsearchIndex(String)
     */
    @Override
    public void deleteElasticsearchIndex(String index) {
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest(index);

        try {
            esClient.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
            log.info("\n\n\t===============\n\tDELETED ELASTICSEARCH INDEX {}\n\t===============\n\n", index);
        } catch (ValidationException | ElasticsearchStatusException | IOException e) {
            throw new IllegalStateException(String.format(ERROR_MESSAGE, index, e.getMessage()));
        }
    }

    /**
     * Setup index Elasticsearch: create index and create default index
     *
     * @param tenantName tenantName
     * @param bucketName bucketName
     * @param esTemplatePath esTemplatePath
     * @param initIndexSourcePath initIndexSourcePath
     * @param suffixIndex suffixIndex
     * @return {@link CreateIndexResponse}
     */
    private CreateIndexResponse setupIndexElasticsearch(String tenantName, String bucketName, String esTemplatePath,
            String initIndexSourcePath, String suffixIndex) {
        String index = String.format(INDEX_FORMAT, tenantName, suffixIndex);
        // create index
        String indexTemplate = loadContentFileFromS3(bucketName, esTemplatePath);
        CreateIndexResponse createIndexResponse = createIndexElasticsearch(index, indexTemplate);

        // indexing for initiate source
        indexingDefaultValue(index, bucketName, initIndexSourcePath);

        return createIndexResponse;
    }

    /**
     * Execute create index elasticsearch
     *
     * @param index index
     * @param templateIndex elasticsearchIndexTemplate
     * @return elasticsearchIndexTemplate
     */
    private CreateIndexResponse createIndexElasticsearch(String index, String templateIndex) {
        CreateIndexRequest createIndexRequest = new CreateIndexRequest(index);
        createIndexRequest.settings(Settings.builder()
                .put("index.number_of_shards", NUMBER_OF_SHARDS)
                .put("index.number_of_replicas", NUMBER_OF_REPLICAS));
        createIndexRequest.mapping(templateIndex, XContentType.JSON);

        try {
            CreateIndexResponse response = esClient.indices().create(createIndexRequest, RequestOptions.DEFAULT);
            log.info("\n\n\t===============\n\tCREATED ELASTICSEARCH INDEX {}\n\t===============\n\n", index);
            return response;
        } catch (ValidationException | ElasticsearchStatusException | IOException e) {
            throw new IllegalStateException(String.format(ERROR_MESSAGE, index, e.getMessage()));
        }
    }

    /**
     * Create initiate index
     *
     * @param index index name
     * @param bucketName Name of bucket that contain initiate source index
     * @param initIndexSourcePath path of initiate source file
     */
    private void indexingDefaultValue(String index, String bucketName, String initIndexSourcePath) {
        IndexRequest indexRequest = new IndexRequest(index);
        indexRequest.id(INIT_INDEX_ID);

        String source;
        try {
            source = loadContentFileFromS3(bucketName, initIndexSourcePath);
        } catch (IllegalStateException e) {
            log.error("Do not exist source from S3 to indexing default index {}.", index);
            return;
        }

        indexRequest.source(source, XContentType.JSON);

        try {
            esClient.index(indexRequest, RequestOptions.DEFAULT);
        } catch (ActionRequestValidationException | ElasticsearchStatusException | IOException e) {
            throw new IllegalStateException(String.format(ERROR_MESSAGE, index, e.getMessage()));
        }

    }

    /**
     * Load content file from S3
     *
     * @param bucketName Name of bucket
     * @param s3FileKey path of file target
     * @return List of line content
     */
    private String loadContentFileFromS3(String bucketName, String s3FileKey) {
        try {
            return new ByteSource() {
                @Override
                public InputStream openStream() {
                    return s3Client.getObject(new GetObjectRequest(bucketName, s3FileKey))
                            .getObjectContent();
                }
            }.asCharSource(StandardCharsets.UTF_8).readLines()
                    .stream().collect(Collectors.joining(System.lineSeparator()));
        } catch (AmazonClientException | IOException e) {
            String message = String.format("Cannot download file from S3. Bucket name = %s, key = %s",
                    bucketName, s3FileKey);
            log.error(message);
            throw new IllegalStateException(message, e);
        }
    }
}
