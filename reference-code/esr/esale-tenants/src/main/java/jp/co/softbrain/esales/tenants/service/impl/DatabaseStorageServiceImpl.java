package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.TENANT_ITEM;

import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.config.ApplicationProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus;
import jp.co.softbrain.esales.tenants.repository.PostgresRepository;
import jp.co.softbrain.esales.tenants.repository.StoragesManagementRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.DatabaseStorageService;
import jp.co.softbrain.esales.tenants.service.MPackagesServicesService;
import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.dto.ErrorDTO;
import jp.co.softbrain.esales.tenants.service.dto.ErrorItemDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetDatabaseStorageDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetDatabaseStorageResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetDatabaseStorageServiceDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetUsedStorageDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.StoragesManagementDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantActiveDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateUsageStorageResponseDTO;
import jp.co.softbrain.esales.tenants.service.mapper.StoragesManagementMapper;


/**
 * Service implementation for process usage storage.
 *
 * @author nguyenvietloi
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class DatabaseStorageServiceImpl extends AbstractTenantService implements DatabaseStorageService {

    private static final String S3_PATH_PREFIX = "tenants/%s/%s/service_data";

    private final Logger log = LoggerFactory.getLogger(DatabaseStorageServiceImpl.class);

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private RestHighLevelClient restClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StoragesManagementRepository storagesManagementRepository;

    @Autowired
    private MPackagesServicesService mPackagesServicesService;

    @Autowired
    private PostgresRepository postgresRepository;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private StoragesManagementMapper storagesManagementMapper;

    /**
     * @see DatabaseStorageService#getDatabaseStorage(String)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public GetDatabaseStorageResponseDTO getDatabaseStorage(String contractTenantId) {

        if (StringUtils.isBlank(contractTenantId)) {
            return createDatabaseStorageResponseError(createErrorDTO(Constants.REQUIRED_PARAMETER, "contractTenantId"));
        }

        try {
            // check exist tenant
            if (!commonService.isExistTenant(null, contractTenantId)) {
                return createDatabaseStorageResponseError(createErrorDTO(Constants.ITEM_NOT_EXIST, TENANT_ITEM));
            }

            // find storage management
            List<GetUsedStorageDTO> storagesManagementDTOs = storagesManagementRepository.getDatabaseStorage(contractTenantId);
            List<GetDatabaseStorageServiceDTO> databaseStorageServiceDTOs = new ArrayList<>();

            long totalStorage = 0;
            for (GetUsedStorageDTO storageManagement : storagesManagementDTOs) {
                String microServiceName = storageManagement.getMicroServiceName();
                long usedStorage = storageManagement.getUsedStorage();
                databaseStorageServiceDTOs.add(new GetDatabaseStorageServiceDTO(microServiceName, usedStorage));

                totalStorage += usedStorage;
            }

            GetDatabaseStorageResponseDTO responseDTO = new GetDatabaseStorageResponseDTO();
            responseDTO.setStatus(ResponseStatus.SUCCESS.getValue());
            responseDTO.setData(new GetDatabaseStorageDataDTO(totalStorage, databaseStorageServiceDTOs));
            return responseDTO;
        } catch (DataIntegrityViolationException e) {
            log.error(e.getMessage());
            return createDatabaseStorageResponseError(createErrorDTO(Constants.INTERRUPT_API));
        }
    }

    /**
     * @see DatabaseStorageService#updateUsageStorage(List)
     */
    @Override
    @Transactional
    public List<UpdateUsageStorageResponseDTO> updateUsageStorage(List<Long> tenantIds) {
        List<UpdateUsageStorageResponseDTO> responseDTOs = new ArrayList<>();

        // 1. get list tenant active by tenantIds
        List<TenantActiveDTO> tenants = tenantService.getTenantActiveByIds(tenantIds);
        if (tenants.isEmpty()) {
            UpdateUsageStorageResponseDTO responseDTO = new UpdateUsageStorageResponseDTO();
            responseDTO.setError(new ErrorItemDTO("get_tenants", getMessage(Constants.ITEM_NOT_EXIST, TENANT_ITEM)));
            responseDTOs.add(responseDTO);
            return responseDTOs;
        }

        tenants.forEach(tenant -> {
            Long tenantId = tenant.getTenantId();
            String tenantName = tenant.getTenantName();

            UpdateUsageStorageResponseDTO responseDTO = new UpdateUsageStorageResponseDTO(tenantId, null);

            // 3.1 get size data Elasticsearch
            Map<String, Long> dataES;
            try {
                dataES = new HashMap<>(getUsedStorageElasticsearch(tenantName));
            } catch (IOException e) {
                log.error("Cannot get used storage elasticsearch. Tenant name: {}. Error message: {}",
                    tenantName, e.getMessage());
                responseDTO.setError(new ErrorItemDTO("get_amount_elasticsearch", e.getMessage()));
                responseDTOs.add(responseDTO);
                return;
            }

            // 2. get list micro_services of tenant
            List<Long> packageIds = mPackagesServicesService.findPackageIdsOfTenant(tenantId);
            List<ServicesPackagesDTO> services = mPackagesServicesService.findServicesByPackageIds(packageIds);

            // get list microServiceName not blank and not duplicate
            List<String> microServiceNames = services.stream()
                .map(ServicesPackagesDTO::getMicroServiceName)
                .filter(StringUtils::isNotBlank)
                .distinct()
                .collect(Collectors.toList());

            Map<String, Long> dataPostgres = new HashMap<>();
            Map<String, Long> dataS3 = new HashMap<>();
            microServiceNames.forEach(microServiceName -> {
                // 3.2 get size data Postgres
                try {
                    Long sizeDB = postgresRepository.getUsedStorageBySchema(microServiceName, tenantName);
                    dataPostgres.put(microServiceName, sizeDB);
                } catch (SQLException e) {
                    log.error("Cannot get used storage postgres. Micro service name: {}, tenant name: {}. Error message: {}",
                        microServiceName, tenantName, e.getMessage());
                    responseDTO.setError(new ErrorItemDTO("get_amount_db", e.getMessage()));
                    responseDTOs.add(responseDTO);
                    return;
                }

                // 3.3 get size data S3
                try {
                    Long sizeS3 = getUsedStorageS3(microServiceName, tenantName);
                    dataS3.put(microServiceName, sizeS3);
                } catch (SdkClientException e) {
                    log.error("Cannot get used storage S3. Micro service name: {}, tenant name: {}. Error message: {}",
                        microServiceName, tenantName, e.getMessage());
                    responseDTO.setError(new ErrorItemDTO("get_amount_db", e.getMessage()));
                    responseDTOs.add(responseDTO);
                }
            });

            // 4. update storage management
            // 4.1 delete storage management of old micro service
            storagesManagementRepository.deleteByTenantId(tenantId);
            // check deletion
            if (storagesManagementRepository.countByTenantId(tenantId) > 0) {
                responseDTO.setError(new ErrorItemDTO("update_storages_management",
                    getMessage(Constants.DELETE_FAILED)));
                responseDTOs.add(responseDTO);
                return;
            }

            // 4.2 insert storage management micro service
            services.forEach(microService -> {
                String microServiceName = microService.getMicroServiceName();
                StoragesManagementDTO storagesManagement = new StoragesManagementDTO();
                storagesManagement.setTenantId(tenantId);
                storagesManagement.setMicroServiceName(microServiceName);
                storagesManagement.setUsedStorageS3(dataS3.get(microServiceName));
                long sizeES = Optional.ofNullable(dataES.get(microServiceName)).orElse(0L);
                storagesManagement.setUsedStorageElasticsearch(sizeES);
                storagesManagement.setUsedStorageDatabase(dataPostgres.get(microServiceName));
                long userId = getUserIdFromToken();
                storagesManagement.setCreatedUser(userId);
                storagesManagement.setUpdatedUser(userId);
                storagesManagementRepository.save(storagesManagementMapper.toEntity(storagesManagement));
            });

            responseDTOs.add(responseDTO);
        });

        return responseDTOs;
    }

    /**
     * Create {@link GetDatabaseStorageResponseDTO}.
     *
     * @param error error.
     * @return Create {@link GetDatabaseStorageResponseDTO}.
     */
    private GetDatabaseStorageResponseDTO createDatabaseStorageResponseError(ErrorDTO error) {
        GetDatabaseStorageResponseDTO responseDTO = new GetDatabaseStorageResponseDTO();
        responseDTO.setStatus(ResponseStatus.ERROR.getValue());
        responseDTO.setErrors(Collections.singletonList(error));
        return responseDTO;
    }

    /**
     * Get used storage elastic search of indices.
     *
     * @param tenantName name of tenant
     * @return map name and size of microservice
     * @throws IOException if a low-level I/O problem (unexpected end-of-input, network error) occurs.
     */
    private Map<String, Long> getUsedStorageElasticsearch(String tenantName) throws IOException {
        String uri = String.format("/_cat/indices/%s_*", tenantName);
        Request request = new Request("GET", uri);
        request.addParameter("bytes", "b");
        request.addParameter("v", "true");
        request.addParameter("format", "json");

        Response response = restClient.getLowLevelClient().performRequest(request);
        List<Map<String, Object>> indices = objectMapper.readValue(
            new InputStreamReader(response.getEntity().getContent()), new TypeReference<>() {});

        Map<String, Long> usedStorageESMap = new HashMap<>();
        // get name and size of micro service from index
        indices.forEach(document -> {
            // index format: [tenant.tenant_name]_[m_services.micro_service_name]
            String microServiceName = getMicroServiceNameFromIndex(document.get("index").toString(), tenantName);
            Long size = Long.valueOf(document.get("store.size").toString());
            usedStorageESMap.put(microServiceName, size);
        });

        return usedStorageESMap;
    }

    /**
     * Get used storage on S3.
     *
     * @param microServiceName name of microService
     * @param tenantName name of tenant
     * @return total used storage on S3 of micro service
     */
    private Long getUsedStorageS3(String microServiceName, String tenantName) {
        String bucketName = applicationProperties.getUploadBucket();
        String prefix = String.format(S3_PATH_PREFIX, tenantName, microServiceName);

        ObjectListing listObjects = s3Client.listObjects(bucketName, prefix);
        List<S3ObjectSummary> summaries = listObjects.getObjectSummaries();
        while (listObjects.isTruncated()) {
            listObjects = s3Client.listNextBatchOfObjects(listObjects);
            summaries.addAll(listObjects.getObjectSummaries());
        }

        return summaries.stream().mapToLong(S3ObjectSummary::getSize).sum();
    }

    /**
     * Get micro service name from index ES
     *
     * @param index index
     * @param tenantName tenantName
     * @return micro service name
     */
    private String getMicroServiceNameFromIndex(String index, String tenantName) {
        String suffix = index.replaceFirst(tenantName + "_", "");

        return Arrays.stream(ConstantsTenants.ElasticsearchIndexEnum.values())
                .filter(value -> value.getSuffix().equals(suffix))
                .map(ConstantsTenants.ElasticsearchIndexEnum::getMicroServiceName)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Unknown microservice of index: " + index));
    }
}
