package jp.co.softbrain.esales.tenants.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tenants.config.ApplicationProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.repository.LicensePackagesRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.QuickSightSettingProvider;
import jp.co.softbrain.esales.tenants.service.SettingElasticsearchEnvironmentService;
import jp.co.softbrain.esales.tenants.service.SettingEnvironmentService;
import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.dto.MTemplateInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantEnvironmentDTO;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateElasticsearchIndexResult;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateS3StorageResult;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.CreateSchemaResult;
import jp.co.softbrain.esales.tenants.service.dto.settingenvironment.SettingEnvironmentResult;
import jp.co.softbrain.esales.tenants.util.SettingEnvironmentUtil;
import jp.co.softbrain.esales.tenants.util.TenantRestOperationUtil;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.SettingEnvironmentResponse;

/**
 * Service implementation for managing SettingEnvironment.
 *
 * @author tongminhcuong
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class SettingEnvironmentServiceImpl extends AbstractTenantService implements SettingEnvironmentService {

    private static final String TENANT_ID_PARAMETER_NAME = "tenantId";

    private static final String LANGUAGE_ID_PARAMETER_NAME = "languageId";

    private static final String TENANT = "テナント";

    public static final int UNMADE_TENANT_CREATION_STATUS = 1; /* 未作成 */

    private static final int DOING_TENANT_CREATION_STATUS = 2; /* 作成中 */

    private static final int FINISHED_TENANT_CREATION_STATUS = 3; /* 作成完了 */

    private static final String INITIATE_DATABASE_ERROR_NAME = "create_database";

    private static final String TENANT_CREATING_ERROR_NAME = "create_tenant";

    private static final String INITIATE_STORAGE_S3_ERROR_NAME = "create_storage_s3";

    private static final String CREATE_ELASTICSEARCH_INDEX_ERROR_NAME = "create_index_elasticsearch";

    private static final String SETTING_QUICK_SIGHT_ERROR_NAME = "setting_quick_sight";

    private final Logger log = LoggerFactory.getLogger(SettingEnvironmentServiceImpl.class);

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private LicensePackagesRepository licensePackagesRepository;

    @Autowired
    private SettingElasticsearchEnvironmentService settingElasticsearchEnvironmentService;

    @Autowired
    private TenantRestOperationUtil tenantRestOperationUtil;

    @Autowired
    private SettingEnvironmentUtil settingEnvironmentUtil;

    @Autowired
    private QuickSightSettingProvider quicksightSettingProvider;

    /**
     * @see SettingEnvironmentService#settingEnvironment(Long, Long, boolean)
     */
    @Override
    @Transactional
    public SettingEnvironmentResponse settingEnvironment(Long tenantId, Long languageId, boolean isSettingQuickSight) {
        // ============== 1. Validate parameter ==============
        checkNotNullParameter(TENANT_ID_PARAMETER_NAME, tenantId);
        checkNotNullParameter(LANGUAGE_ID_PARAMETER_NAME, languageId);

        // ============== 2. Get Tenant's information ==============
        TenantEnvironmentDTO tenantEnvironment = tenantService.getTenantEnvironmentForUpdate(tenantId);
        if (tenantEnvironment == null) {
            throw new CustomException(getMessage(Constants.ITEM_NOT_EXIST, ConstantsTenants.TENANT_ITEM),
                    TENANT, Constants.ITEM_NOT_EXIST);
        }

        // ============== 3. Check creation status of Tenant ==============
        String tenantName = tenantEnvironment.getTenantName();
        switch (tenantEnvironment.getCreationStatus()) {
            case UNMADE_TENANT_CREATION_STATUS:
                break;

            case DOING_TENANT_CREATION_STATUS:
                throw new CustomException(getMessage(Constants.TENANT_CREATING_ERROR),
                        TENANT_CREATING_ERROR_NAME, Constants.TENANT_CREATING_ERROR);

            case FINISHED_TENANT_CREATION_STATUS:
                return new SettingEnvironmentResponse(getMessage(Constants.ESTABLISH_SUCCESS));
            default:
                log.error("Unknown tenant creation status. tenant_id = {}, creation_status = {}", tenantId,
                        tenantEnvironment.getCreationStatus());
                throw new IllegalStateException("Unknown tenant creation status");
        }

        // 4. Update creation_status to 2 (作成中)
        tenantService.updateCreationStatus(tenantId, DOING_TENANT_CREATION_STATUS);

        // ============== 5. Get Tenant's environment information ==============
        // 5.1 Get package list of Tenant
        List<String> microServiceNameList = commonService.getAllSellServices();

        // Create environment for Tenant
        SettingEnvironmentResult initiateEnvironmentResult = new SettingEnvironmentResult();
        try {
            // ============== Step 6, 7, 8: Setting Database, AmazonS3, Elasticsearch ==============
            initiateEnvironmentResult = initiateEnvironment(tenantId, tenantEnvironment,
                    microServiceNameList);

            // ============== 9. Update master data ==============
            // 9.1 Get list of package
            List<Long> mPackageIdList = licensePackagesRepository.findMPackageIdByTenantId(tenantId);

            SettingEnvironmentResult finalInitiateEnvironmentResult = initiateEnvironmentResult;
            Runnable rollbackFunction = () -> settingEnvironmentUtil.rollbackWhenErrorOccurred(tenantId,
                    finalInitiateEnvironmentResult);

            // 9.2 Create Department
            // 9.2.1 Create Parent Department
            Long departmentId = callCreateParentDepartment(tenantName, tenantEnvironment.getCompanyName(), rollbackFunction);

            // 9.2.2 Create Child Department
            callCreateChildDepartment(tenantName, tenantEnvironment.getDepartmentName(), departmentId, rollbackFunction);

            // 9.3 Create Position
            Long positionId = callCreatePosition(tenantName, tenantEnvironment.getPositionName(), rollbackFunction);

            // 9.4 Create Employee
            callCreateEmployee(tenantEnvironment, languageId, mPackageIdList,
                    departmentId, positionId, rollbackFunction);

            // 9.5 Create Product
            callCreateProduct(tenantName, tenantEnvironment.getProductName(), rollbackFunction);

            // 9.6 Update data periods
            callUpdatePeriod(tenantName, tenantEnvironment.getAccountClosingMonth(), rollbackFunction);

            // 9.7 Update data holiday
            callUpdateHoliday(tenantName, tenantEnvironment.getCalendarDay(), rollbackFunction);

            // 9.8 Create data customers
            callCreateCustomer(tenantEnvironment, rollbackFunction);

            // 9.9 Setting Quick sight
            if (isSettingQuickSight) {
                executeSettingQuickSight(tenantId, tenantName, rollbackFunction);
            }

        } catch (CustomException e) { // rollback process is executed
            throw e;
        } catch (Exception e) { // unknown error
            // rollback tenant.creation_status to 1 (未作成)
            settingEnvironmentUtil.rollbackWhenErrorOccurred(tenantId, initiateEnvironmentResult);

            log.error("Unexpected error occurred.");
            throw e;
        }

        // ============== 12. Update creation status for Tenant to FINISHED ==============
        // update creation_status to 3 with commit transaction
        tenantService.updateCreationStatus(tenantId, FINISHED_TENANT_CREATION_STATUS);

        return new SettingEnvironmentResponse(getMessage(Constants.ESTABLISH_SUCCESS));
    }

    /**
     * Initiate environment for Tenant: Database, AmazonS3, Elasticsearch
     *
     * @param tenantId The id of tenant
     * @param tenantEnvironment The tenant information
     * @param microServiceNameList List of service info that are related tenant target
     * @return {@link SettingEnvironmentResult} result after setting
     */
    private SettingEnvironmentResult initiateEnvironment(Long tenantId, TenantEnvironmentDTO tenantEnvironment,
            List<String> microServiceNameList) {
        // create object to save result of setting environment
        SettingEnvironmentResult settingEnvironmentResult = new SettingEnvironmentResult();

        String tenantName = tenantEnvironment.getTenantName();

        // ============== 6. Create database ==============
        // 6.1 Get m_templates then create map: micro_service_name -> of master_template
        Map<String, MTemplateInfoDTO> microServiceNameAndTemplatesMap = settingEnvironmentUtil
                .makeMicroServiceNameAndTemplatesMap(tenantEnvironment.getMIndustryId(), microServiceNameList);

        // 6.2 Create database with master template
        // initiate database for services with multiple thread
        List<CreateSchemaResult> createSchemaResultList = settingEnvironmentUtil.executeInitiateDatabase(tenantName,
                microServiceNameAndTemplatesMap, tenantEnvironment.getIndustryTypeName(), tenantEnvironment.getSchemaName());

        // save schema result to rollback
        settingEnvironmentResult.setCreateSchemaResultList(createSchemaResultList);

        // Judge after create database
        boolean isCreatedDatabaseSuccessfully = createSchemaResultList.stream().allMatch(CreateSchemaResult::isSuccessfully);
        if (!isCreatedDatabaseSuccessfully) {
            // rollback
            settingEnvironmentUtil.rollbackWhenErrorOccurred(tenantId, settingEnvironmentResult);
            // return error
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    INITIATE_DATABASE_ERROR_NAME, Constants.INTERRUPT_API);
        }

        // ============== 7. Create folders in AmazonS3 ==============
        CreateS3StorageResult createS3StorageResult = settingEnvironmentUtil.initiateStorageAmazonS3(
                applicationProperties.getUploadBucket(), tenantName, microServiceNameList);

        // save S3 storage result to rollback
        settingEnvironmentResult.setCreateS3StorageResult(createS3StorageResult);

        // Judge after create folders
        if (!createS3StorageResult.isSuccessfully()) {
            // rollback
            settingEnvironmentUtil.rollbackWhenErrorOccurred(tenantId, settingEnvironmentResult);
            // return error
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    INITIATE_STORAGE_S3_ERROR_NAME, Constants.INTERRUPT_API);
        }

        // ============== 8. Create serviceName Elasticsearch ==============
        CreateElasticsearchIndexResult elasticsearchIndexResult = settingElasticsearchEnvironmentService
                .createElasticsearchIndex(tenantName, microServiceNameList);

        // save elasticsearch result to rollback
        settingEnvironmentResult.setCreateElasticsearchIndexResult(elasticsearchIndexResult);

        if (!elasticsearchIndexResult.isSuccessfully()) {
            // rollback
            settingEnvironmentUtil.rollbackWhenErrorOccurred(tenantId, settingEnvironmentResult);
            // return error
            log.error(elasticsearchIndexResult.getErrorMessage());
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    CREATE_ELASTICSEARCH_INDEX_ERROR_NAME, Constants.INTERRUPT_API);
        }

        return new SettingEnvironmentResult(createSchemaResultList, createS3StorageResult,
                elasticsearchIndexResult, null /* settingQuickSightResult */);
    }

    /**
     * Setting quick sight
     *
     * @param tenantId tenantId
     * @param tenantName tenantName
     * @param rollbackFunction rollbackFunction
     */
    private void executeSettingQuickSight(Long tenantId, String tenantName, Runnable rollbackFunction) {
        try {
            quicksightSettingProvider.settingQuickSight(tenantId, tenantName);
        } catch (IllegalStateException e) {
            log.error("Setting QuickSight failed. Message = {}", e.getMessage(), e);
            // rollback
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    SETTING_QUICK_SIGHT_ERROR_NAME, Constants.INTERRUPT_API);
        }
    }

    /**
     * Create department
     *
     * @param tenantName The name of tenant target
     * @param departmentName Name of department
     * @param rollbackFunction rollbackFunction
     * @return department_id
     */
    private Long callCreateParentDepartment(String tenantName, String departmentName, Runnable rollbackFunction) {
        try {
            return tenantRestOperationUtil.createDepartment(tenantName, departmentName, null /* parentId */);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API createDepartment failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    "create_department", Constants.INTERRUPT_API);
        }
    }

    /**
     * Create department
     *
     * @param tenantName The name of tenant target
     * @param departmentName Name of department
     * @param parentId parentId
     * @param rollbackFunction rollbackFunction
     * @return department_id
     */
    private Long callCreateChildDepartment(String tenantName, String departmentName,
            Long parentId, Runnable rollbackFunction) {
        try {
            return tenantRestOperationUtil.createDepartment(tenantName, departmentName, parentId);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API create-department failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    "create_child_department", Constants.INTERRUPT_API);
        }
    }

    /**
     * Call API updatePositions
     *
     * @param tenantName The name of tenant target
     * @param positionName Name of position
     * @param rollbackFunction rollbackFunction
     * @return position_id
     */
    private Long callCreatePosition(String tenantName, String positionName, Runnable rollbackFunction) {
        if (positionName == null) {
            return null;
        }

        try {
            return tenantRestOperationUtil.updatePositions(tenantName, positionName, true /* isAvailable */);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API update-positions failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    "create_positions", Constants.INTERRUPT_API);
        }
    }

    /**
     * Call API createEmployee
     *
     * @param tenant TenantEnvironmentDTO
     * @param languageId languageId
     * @param packageIdList packageIdList
     * @param departmentId departmentId
     * @param positionId positionId
     * @param rollbackFunction rollbackFunction
     * @return employeeId
     */
    private Long callCreateEmployee(TenantEnvironmentDTO tenant, Long languageId,
            List<Long> packageIdList, Long departmentId, Long positionId, Runnable rollbackFunction) {

        try {
            return tenantRestOperationUtil.createEmployee(tenant, languageId, packageIdList, departmentId, positionId);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API create-employee failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    "create_employees", Constants.INTERRUPT_API);
        }
    }

    /**
     * Call API createProduct
     *
     * @param tenantName tenantName
     * @param productName productName
     * @param rollbackFunction rollbackFunction
     */
    private void callCreateProduct(String tenantName, String productName, Runnable rollbackFunction) {
        if (productName == null) {
            return;
        }

        try {
            tenantRestOperationUtil.createProduct(tenantName, productName);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API create-product failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    "create_products", Constants.INTERRUPT_API);
        }
    }

    /**
     * Call API updatePeriod
     *
     * @param tenantName tenantName
     * @param accountClosingMonth accountClosingMonth
     * @param rollbackFunction rollbackFunction
     */
    private void callUpdatePeriod(String tenantName, Integer accountClosingMonth, Runnable rollbackFunction) {
        if (accountClosingMonth == null) {
            return;
        }

        try {
            tenantRestOperationUtil.updatePeriod(tenantName, accountClosingMonth, true /* isCalendarYear */);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API update-period failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    "update_periods", Constants.INTERRUPT_API);
        }
    }

    /**
     * Call API updateHoliday
     *
     * @param tenantName tenantName
     * @param calendarDay calendarDay
     */
    private void callUpdateHoliday(String tenantName, Integer calendarDay, Runnable rollbackFunction) {
        if (calendarDay == null) {
            return;
        }

        try {
            tenantRestOperationUtil.updateHoliday(tenantName, calendarDay);
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API update-holiday failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API),
                    "update_holidays", Constants.INTERRUPT_API);
        }
    }

    /**
     * Call API createCustomer
     *
     * @param tenant TenantEnvironmentDTO
     * @param rollbackFunction rollbackFunction
     */
    private void callCreateCustomer(TenantEnvironmentDTO tenant, Runnable rollbackFunction) {
        try {
            tenantRestOperationUtil.createCustomer(tenant.getTenantName(), tenant.getCustomerName(),
                    tenant.getBusinessMainId(), tenant.getBusinessSubId());
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API create-customer failed. Message = {}", e.getMessage());
            rollbackFunction.run();
            throw new CustomException(getMessage(Constants.INTERRUPT_API), "create_customer", Constants.INTERRUPT_API);
        }
    }

    /**
     * Check not null for a parameter
     *
     * @param parameterName name of parameter
     * @param parameter parameter
     */
    private void checkNotNullParameter(String parameterName, Object parameter) {
        if (Objects.isNull(parameter)) {
            throw new CustomException(getMessage(Constants.REQUIRED_PARAMETER, parameterName),
                    parameterName, Constants.REQUIRED_PARAMETER);
        }
    }
}
