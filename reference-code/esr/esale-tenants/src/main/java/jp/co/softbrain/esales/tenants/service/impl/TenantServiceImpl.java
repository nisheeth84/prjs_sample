package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.ecs.model.AwsVpcConfiguration;
import com.amazonaws.services.ecs.model.KeyValuePair;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.util.CollectionUtils;
import com.amazonaws.util.StringUtils;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.ApplicationProperties;
import jp.co.softbrain.esales.tenants.config.AwsEcsConfigProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants.TenantContractStatus;
import jp.co.softbrain.esales.tenants.repository.LicensePackagesRepository;
import jp.co.softbrain.esales.tenants.repository.OtherServiceRepositoryCustom;
import jp.co.softbrain.esales.tenants.repository.PaymentsManagementRepository;
import jp.co.softbrain.esales.tenants.repository.StoragesManagementRepository;
import jp.co.softbrain.esales.tenants.repository.TenantsRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CognitoAccountService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.MPackagesServicesService;
import jp.co.softbrain.esales.tenants.service.dto.MessageDTO;
import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.dto.AvailableLicensePackage;
import jp.co.softbrain.esales.tenants.service.dto.CompanyNameResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetStatusTenantDTO;
import jp.co.softbrain.esales.tenants.service.dto.MessageResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.StatusContractDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantActiveDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantByConditionDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantDeleteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantEnvironmentDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantServicesResDTO;
import jp.co.softbrain.esales.utils.AwsRunTaskUtil;
import jp.co.softbrain.esales.utils.DateUtil;

/**
 * Service Implementation for TenantService
 *
 * @author phamhoainam
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class TenantServiceImpl extends AbstractTenantService implements TenantService {
    private final Logger log = LoggerFactory.getLogger(TenantServiceImpl.class);

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private MPackagesServicesService mPackagesServicesService;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private AwsEcsConfigProperties awsEcsConfigProperties;

    @Autowired
    private RestHighLevelClient elsClient;

    @Autowired
    private TenantsRepository tenantsRepository;

    @Autowired
    private CommonService commonService;

    @Autowired
    private CognitoAccountService cognitoAccountService;

    @Autowired
    private LicensePackagesRepository licensePackagesRepository;

    @Autowired
    private StoragesManagementRepository storagesManagementRepository;

    @Autowired
    private PaymentsManagementRepository paymentsManagementRepository;

    @Autowired
    private OtherServiceRepositoryCustom otherServiceRepositoryCustom;

    /**
     * @see TenantService#getTenantServices()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<TenantServicesResDTO> getTenantServices() {
        List<TenantNameDTO> tenantNameDTOS = tenantsRepository
                .getTenantServices(ConstantsTenants.TenantCreationStatus.CREATED.getValue(), Boolean.TRUE);

        List<TenantServicesResDTO> results = new ArrayList<>();
        for (TenantNameDTO dto : tenantNameDTOS) {
            List<Long> packageIds = mPackagesServicesService.findPackageIdsOfTenant(dto.getTenantId());
            List<String> microServiceNames = mPackagesServicesService.findMicroServiceNameOfTenant(packageIds);

            results.add(new TenantServicesResDTO(dto.getTenantId(), dto.getTenantName(), microServiceNames));
        }

        return results;
    }

    /**
     * @see TenantService#getTenantByCondition(String, String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<TenantByConditionDTO> getTenantByCondition(String tenantName, String companyName) {
        // get data from DB
        return tenantsRepository.getTenantByCondition(tenantName, companyName);
    }

    /**
     * @see TenantService#getTenantActiveByIds(List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<TenantActiveDTO> getTenantActiveByIds(List<Long> tenantIds) {
        return tenantsRepository.getTenantActiveByIds(tenantIds);
    }

    /**
     * @see TenantService#getTenantLicensePackage(String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<AvailableLicensePackage> getTenantLicensePackage(String tenantName) {
        return tenantsRepository.findTenantLicensePackage(tenantName, Instant.now());
    }

    /**
     * @see TenantService#getTenantNameByContractId(String)
     */
    @Override
    public String getTenantNameByContractId(String contractId) {
        return tenantsRepository.getTenantNameByContractId(contractId);
    }

    /**
     * @see TenantService#getTenantEnvironmentForUpdate(Long)
     */
    @Override
    public TenantEnvironmentDTO getTenantEnvironmentForUpdate(Long tenantId) {
        return tenantsRepository.findTenantEnvironmentForUpdate(tenantId);
    }

    /**
     * @see TenantService#updateCreationStatus(Long, Integer)
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateCreationStatus(Long tenantId, Integer creationStatus) {
        tenantsRepository.updateCreationStatus(tenantId, creationStatus);
    }

    /**
     * @see TenantService#getTenantContractByContractId(String)
     */
    @Override
    public Optional<TenantNameDTO> getTenantContractByContractId(String contractTenantId) {
        return tenantsRepository.getTenantContractByContractId(contractTenantId);
    }

    /**
     * @see TenantService#getCompanyName(String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CompanyNameResponseDTO getCompanyName(String tenantNameRes) {
        log.debug("Request to get Company Name : {}", tenantNameRes);
        String message = null;
        CompanyNameResponseDTO companyNameResponseDTO = null;

        // Validate parameter
        if (tenantNameRes == null || tenantNameRes.isEmpty()) {
            message = getMessage(Constants.REQUIRED_PARAMETER, ConstantsTenants.TENANT_ITEM);
            throw new CustomException(message, ConstantsTenants.TENANT_ITEM, Constants.REQUIRED_PARAMETER);
        }

        // Validate exists tenant:
        boolean result = commonService.isExistTenant(tenantNameRes, null);
        if (!result) {
            // ERR_COM_0035
            message = getMessage(Constants.ITEM_NOT_EXIST, ConstantsTenants.TENANT_ITEM);
            throw new CustomException(message, ConstantsTenants.TENANT_ITEM, Constants.ITEM_NOT_EXIST);
        }

        // 2. Get the company name
        String companyName = tenantsRepository.findCompanyNameByTenantName(tenantNameRes);
        if (companyName != null) {
            companyNameResponseDTO = new CompanyNameResponseDTO(companyName);
        }

        log.debug("END Request to get Company Name");
        return companyNameResponseDTO;
    }

    /**
     * @see TenantService#getStatusContract(String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public StatusContractDataDTO getStatusContract(String tenantNameRes) {
        log.debug("START get Status Contract service : {}", tenantNameRes);
        StatusContractDataDTO contractDataDTO = null;
        String message = null;

        // Validate parameter
        if (tenantNameRes == null || tenantNameRes.isEmpty()) {
            message = getMessage(Constants.REQUIRED_PARAMETER, ConstantsTenants.TENANT_ITEM);
            throw new CustomException(message, ConstantsTenants.TENANT_ITEM, Constants.REQUIRED_PARAMETER);
        }

        // Get status contract
        contractDataDTO = tenantsRepository.getStatusContract(tenantNameRes);

        if (contractDataDTO == null) {
            message = getMessage(Constants.REQUIRED_PARAMETER, ConstantsTenants.TENANT_ITEM);
            throw new CustomException(message, ConstantsTenants.TENANT_ITEM, Constants.PARAMETER_INVALID);
        }

        return contractDataDTO;
    }

    /**
     * @see TenantService#getTenantName(List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<TenantNameDTO> getTenantName(List<Long> tenantIds) {
        return tenantsRepository.getTenantNameByIDs(tenantIds);
    }

    /**
     * @see TenantService#deleteDataTenantByTenantDto(TenantNameDTO)
     */
    @Override
    @Transactional
    public TenantDeleteResponseDTO deleteDataTenantByTenantDto(TenantNameDTO tenantNameDTO) {
        String item = null;

        try {
            // 2.2 Delete elasicsearch
            item = "delete_elasticsearch";
            deleteElasticSearchIndex(tenantNameDTO.getTenantName());

            // 2.3 delete S3 storage
            item = "delete_S3";
            deleteS3Storage(tenantNameDTO.getTenantName());

            item = "delete_database";
            // 2.1 get list service
            List<String> microServiceNames = commonService.getAllSellServices();

            // 2.4 Delete database
            for (String microServiceName : microServiceNames) {
                otherServiceRepositoryCustom.dropSchema(microServiceName, tenantNameDTO.getTenantName());
            }

            // 2.5 delete user AWS
            item = "delete_user_AWS";
            cognitoAccountService.deleteAccountCognitoByAccessContract(tenantNameDTO.getUserPoolId(), false);
        } catch (Exception e) {
            return buildErrorResponseDto(tenantNameDTO.getTenantId(), item, e.getMessage());
        }

        return buildErrorResponseDto(tenantNameDTO.getTenantId(), null, null);
    }

    /**
     * @see TenantService#getTenantStatus(String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public ContractSiteResponseDTO getTenantStatus(String contractTenantId) {
        // ============== 1. Validate parameter ==============
        if (StringUtils.isNullOrEmpty(contractTenantId)) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, "contractTenantId"));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        Integer tenantStatus = tenantsRepository.getTenantStatus(contractTenantId)
                .orElse(null);
        if (tenantStatus == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, ConstantsTenants.TENANT_ITEM));

            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        return new ContractSiteResponseDTO(SUCCESS.getValue(),
                new GetStatusTenantDTO(tenantStatus), null /* errors */);
    }

    /**
     * Delete elastic search of tenant
     *
     * @param tenantName name of tenant need delete index
     * @return true if index not exist or delete index success
     * @throws IOException
     */
    private boolean deleteElasticSearchIndex(String tenantName) throws IOException {
        String indexStr = String.format("%s_*", tenantName);
        // Check Elastic search exist
        GetIndexRequest request = new GetIndexRequest(indexStr);
        if (!elsClient.indices().exists(request, RequestOptions.DEFAULT)) {
            return true;
        }

        // Delete Elastic search Index
        DeleteIndexRequest deleteRequest = new DeleteIndexRequest(indexStr);
        AcknowledgedResponse response = elsClient.indices().delete(deleteRequest, RequestOptions.DEFAULT);
        return response.isAcknowledged();
    }

    /**
     * Delete folder S3 of tenant
     *
     * @param tenantName name of tenant need delete directory
     */
    private void deleteS3Storage(String tenantName) {
        String bucketName = applicationProperties.getUploadBucket();
        String folderPath = String.format("%s/%s", Constants.MICRO_SERVICE_TENANTS, tenantName);
        // Check exist folder
        ObjectListing objects = s3Client.listObjects(bucketName, folderPath);

        // Delete folder if exist
        for (S3ObjectSummary objectSummary : objects.getObjectSummaries()) {
            s3Client.deleteObject(bucketName, objectSummary.getKey());
        }
    }

    /**
     * Build TenantDeleteResponseDTO when tenant delete fails
     *
     * @param tenantId id of tenant delete fails
     * @param item component delete fails
     * @param errorMessage message error
     * @return {@link TenantDeleteResponseDTO}
     */
    private TenantDeleteResponseDTO buildErrorResponseDto(Long tenantId, String item, String errorMessage) {
        if (item == null || errorMessage == null) {
            return new TenantDeleteResponseDTO(tenantId, null);
        }
        return new TenantDeleteResponseDTO(
                tenantId,
                new MessageResponseDTO(item, errorMessage));
    }

    /**
     * @see TenantService#deleteDataOfSchemaTenants(List)
     */
    @Override
    @Transactional
    public void deleteDataOfSchemaTenants(List<Long> tenantIds) {
        // 3. Delete data relation of tenant
        // 3.1 Delete data license_subscriptions
        licensePackagesRepository.deleteLicensePackagesByTenantIds(tenantIds);

        // 3.2 Delete data license_options - remove by CR

        // 3.3 Delete data storages_management
        storagesManagementRepository.deleteStoragesManagementByTenantIds(tenantIds);

        // 3.4 Delete data payments_management
        paymentsManagementRepository.deletePaymentsManagementByTenantIds(tenantIds);

        // 4. Update status (deletedDate) of tenant
        tenantsRepository.updateDeletedDate(tenantIds, Instant.now());
    }

    /**
     * @see TenantService#updateTenants(List, int, String, Boolean)
     */
    @Override
    @Transactional
    public ContractSiteResponseDTO updateTenants(List<String> contractIds, int status,
            String trialEndDate, Boolean isDeleteSampleData) {

        // 1. Validate input param
        List<ContractSiteErrorDataDTO> errors = validateInputUpdateTenant(contractIds, status, trialEndDate, isDeleteSampleData);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        // 2. get data tenants
        List<TenantNameDTO> tenantDtos = tenantsRepository.getTenantForUpdate(
                contractIds, ConstantsTenants.TenantCreationStatus.CREATED.getValue());
        if (CollectionUtils.isNullOrEmpty(tenantDtos)) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                getMessage(Constants.ITEM_NOT_EXIST, ConstantsTenants.TENANT_ITEM));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 3.1 Delete Data sample
        if (isDeleteSampleData != null && isDeleteSampleData && !deleteSampleData(tenantDtos)) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API,
                    getMessage(Constants.INTERRUPT_API));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        List<Long> tenantIds = tenantDtos.stream().map(TenantNameDTO::getTenantId).collect(Collectors.toList());

        if (status == TenantContractStatus.DELETED.getStatusCode()) {
            // 3.3 call batch delete Tenants
            List<KeyValuePair> environments = new ArrayList<>();
            environments.add(new KeyValuePair().withName("BATCH_NAME").withValue("deleteTenants"));
            environments.add(new KeyValuePair().withName("TENANT_ID").withValue(tenantIds.toString()));

            AwsVpcConfiguration vpcConfig = new AwsVpcConfiguration()
                    .withSubnets(awsEcsConfigProperties.getVpcSubnet())
                    .withSecurityGroups(awsEcsConfigProperties.getVpcSecurityGroup());

            boolean isSuccess = AwsRunTaskUtil.runAwsFargateTask(
                    awsEcsConfigProperties.getCluster(),
                    awsEcsConfigProperties.getBatchTaskName(),
                    awsEcsConfigProperties.getBatchContainerName(),
                    vpcConfig,
                    "api_updateTenants",
                    environments);
            if (!isSuccess) {
                log.debug("API UpdateTenant: Active Batch DeleteTenants Failure!");
                ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API,
                    getMessage(Constants.INTERRUPT_API));
                return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
            }
        }

        // 3.4 update Tenant status
        updateTenantStatus(tenantIds, status, trialEndDate);

        return new ContractSiteResponseDTO(ERROR.getValue(),
                new MessageDTO(getMessage(Constants.UPDATED)), null /* errors */);
    }

    /**
     * delete sample data in DB
     *
     * @param tenantDtos list tenant will delete
     *        return true if delete success
     */
    private boolean deleteSampleData(List<TenantNameDTO> tenantDtos) {
        for (TenantNameDTO dto : tenantDtos) {
            List<Long> packageIds = mPackagesServicesService.findPackageIdsOfTenant(dto.getTenantId());
            List<String> microServiceNames = mPackagesServicesService.findMicroServiceNameOfTenant(packageIds);
            // delete data sample
            List<String> listServiceNamesDeleted = new ArrayList<>();
            for (String mServiceName : microServiceNames) {
                if (Constants.MICRO_SERVICE_UAA.equals(mServiceName)
                        || Constants.MICRO_SERVICE_EMPLOYEES.equals(mServiceName)
                        || listServiceNamesDeleted.contains(mServiceName)) {
                    continue;
                }
                listServiceNamesDeleted.add(mServiceName);

                try {
                    List<String> tableNames = otherServiceRepositoryCustom.getListTablesInDatabase(
                            mServiceName, dto.getTenantName());
                    otherServiceRepositoryCustom.truncateTableData(mServiceName, dto.getTenantName(), tableNames);
                } catch (Exception e) {
                    log.debug("API UpdateTenant: TRUNCATE TABLE FROM [{}.{}] has exception."
                            , mServiceName, dto.getTenantName());
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * validate input of api update tenant.
     *
     * @param contractIds list contractId
     * @param status status of contract
     * @param trialEndDate end of trail license
     * @param isDeleteSampleData true if delete sample data
     * @return list errors
     */
    private List<ContractSiteErrorDataDTO> validateInputUpdateTenant(
            List<String> contractIds, int status, String trialEndDate, Boolean isDeleteSampleData) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (CollectionUtils.isNullOrEmpty(contractIds)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, "contractIds")));
        }
        if (status < TenantContractStatus.START.getStatusCode()
                || status > TenantContractStatus.DELETED.getStatusCode()) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, "status")));
        }

        if (status == TenantContractStatus.START.getStatusCode()
                && (trialEndDate == null || DateUtil.toDate(trialEndDate) == null)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.DATE_INVALID_CODE,
                    getMessage(Constants.DATE_INVALID_CODE)));
        }

        if (isDeleteSampleData == null) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, "isDeleteSampleData")));
        }
        return errors;
    }

    /**
     * update tenant by Status
     *
     * @param tenantIds list id of tenant will update
     * @param status status of contract
     * @param trialEndDateStr end of date trail contract
     */
    private void updateTenantStatus(List<Long> tenantIds, Integer status, String trialEndDateStr) {
        if (status == TenantContractStatus.START.getStatusCode().intValue()) {
            Date trialEndDate = DateUtil.toDate(trialEndDateStr);
            tenantsRepository.updateTenantStatus(tenantIds, true, status, trialEndDate);
        } else if (status == TenantContractStatus.SUSPENDED.getStatusCode().intValue()) {
            tenantsRepository.updateTenantStatus(tenantIds, false, new Date(), status);
        } else if (status == TenantContractStatus.DELETED.getStatusCode().intValue()) {
            tenantsRepository.updateTenantStatus(tenantIds, false, status);
        }
    }
}
