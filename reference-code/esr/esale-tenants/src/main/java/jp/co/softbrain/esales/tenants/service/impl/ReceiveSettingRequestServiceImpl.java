package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.ecs.model.AwsVpcConfiguration;
import com.amazonaws.services.ecs.model.KeyValuePair;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tenants.config.AwsEcsConfigProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants.TenantCreationStatus;
import jp.co.softbrain.esales.tenants.config.oauth2.CognitoProperties;
import jp.co.softbrain.esales.tenants.domain.LicensePackages;
import jp.co.softbrain.esales.tenants.domain.Tenants;
import jp.co.softbrain.esales.tenants.repository.LicensePackagesRepository;
import jp.co.softbrain.esales.tenants.repository.MIndustriesRepository;
import jp.co.softbrain.esales.tenants.repository.PostgresRepository;
import jp.co.softbrain.esales.tenants.repository.TenantsRepository;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.AuthenticationService;
import jp.co.softbrain.esales.tenants.service.CognitoSettingsService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.ReceiveSettingRequestService;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingsDTO;
import jp.co.softbrain.esales.tenants.service.dto.CognitoUserInfo;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.IndustryDTO;
import jp.co.softbrain.esales.tenants.service.dto.LanguagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.ReceiveCustomersBusinessDTO;
import jp.co.softbrain.esales.tenants.service.dto.ReceiveSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.ReceiveSettingPackagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.ReceiveSettingResDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantReceiveServicesDTO;
import jp.co.softbrain.esales.tenants.service.mapper.TenantsMapper;
import jp.co.softbrain.esales.tenants.tenant.util.TenantUtil;
import jp.co.softbrain.esales.tenants.util.TenantRestOperationUtil;
import jp.co.softbrain.esales.utils.AwsRunTaskUtil;
import jp.co.softbrain.esales.utils.CheckUtil;
import jp.co.softbrain.esales.utils.DateUtil;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse;
import software.amazon.awssdk.utils.CollectionUtils;

/**
 * Service for receive setting request API
 *
 * @author lehuuhoa
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ReceiveSettingRequestServiceImpl extends AbstractTenantService implements ReceiveSettingRequestService {
    private final Logger log = LoggerFactory.getLogger(ReceiveSettingRequestServiceImpl.class);

    private static final String REGEX_INTEGER = "^[-+]?[0-9]+(.[0-9]+)?$";

    private static final String PARAM_INDUSTRY_TYPE_NAME = "industryTypeName";
    private static final String PARAM_CONTRACT_ID = "contractId";
    private static final String PARAM_COMPANY_NAME = "companyName";
    private static final String PARAM_CONTRACT_STATUS = "contractStatus";
    private static final String PARAM_LANGUAGE_CODE = "languageCode";
    private static final String PARAM_DEPARTMENT_NAME = "departmentName";
    private static final String PARAM_EMPLOYEE_SURNAME = "employeeSurname";
    private static final String PARAM_CUSTOMER_NAME = "customerName";
    private static final String PARAM_CUSTOMERS_DB_NAME = "customers";
    private static final int STATUS_START_UP = 1;
    private static final String PARAM_ITEMS_OF_INDUSTRY = "業類の大項目と業類の小項目";
    private static final String PARAM_USER_PACKAGE = "usedPackage";
    private static final String PARAM_PACKAGE = "packages";
    private static final String PARAM_PACKAGE_ID = "packageId/usedPackage";
    private static final String TIME_ZONE = "Asia/Tokyo";
    private static final String FORMAT_DATE = "yyyy-MM-dd";

    private static final String DEFAULT_BUSINESS_MAIN = "サービス業（他に分類されないもの）";

    private static final String DEFAULT_BUSINESS_SUB = "その他の事業サービス業";

    @Autowired
    private AwsEcsConfigProperties awsEcsConfigProperties;

    @Autowired
    private TenantsRepository tenantsRepository;

    @Autowired
    private LicensePackagesRepository licensePackagesRepository;

    @Autowired
    private TenantsMapper tenantsMapper;

    @Autowired
    private CommonService commonService;

    @Autowired
    private PostgresRepository postgresRepository;

    @Autowired
    private MIndustriesRepository mIndustriesRepository;

    @Autowired
    private TenantRestOperationUtil tenantRestOperationUtil;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private CognitoSettingsService cognitoSettingsService;

    @Autowired
    private CognitoProperties cognitoProperties;

    /**
     * @see ReceiveSettingRequestService#receiveSettingRequest(ReceiveSettingResDTO)
     */
    @Override
    @Transactional
    public ContractSiteResponseDTO receiveSettingRequest(ReceiveSettingResDTO requestDataDTO) {
        // Validate parameter
        List<ContractSiteErrorDataDTO> errors = validateReceiveSettingRequestAll(requestDataDTO);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        // if already existed tenant, return error ERR_COM_0036
        boolean result = commonService.isExistTenant(null, requestDataDTO.getContractTenantId());
        if (result) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.TENANTS_NOT_NULL,
                    getMessage(Constants.TENANTS_NOT_NULL, ConstantsTenants.TENANT_ITEM));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // Validate business:
        IndustryDTO industryDTO = mIndustriesRepository.getIndustry(requestDataDTO.getIndustryTypeName());
        if (industryDTO == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, PARAM_INDUSTRY_TYPE_NAME));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }


        try {
            // validate customer business
            ReceiveCustomersBusinessDTO businessDTO = findCustomerBusiness(
                    industryDTO.getSchemaName(), requestDataDTO.getBusinessMain(), requestDataDTO.getBusinessSub());
            if (businessDTO == null) {
                ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, PARAM_ITEMS_OF_INDUSTRY));
                return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
            }

            // 2. Get master data
            // 2.5 get data language
            LanguagesDTO language = getLanguage(requestDataDTO.getLanguageCode(), industryDTO.getSchemaName());
            if (language == null) {
                ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.PARAMETER_INVALID,
                    getMessage(Constants.PARAMETER_INVALID, PARAM_LANGUAGE_CODE));
                return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
            }

            // Get userId from token.
            Long tenantUserId = getUserIdFromToken();

            // 3. Insert tenant
            TenantReceiveServicesDTO tenant = insertDataTenant(requestDataDTO, businessDTO, industryDTO, tenantUserId);
            Long tenantId = tenant.getTenantId();

            // 4. Insert data license packages
            insertDataLicensePackages(requestDataDTO, tenantId, tenantUserId);

            // 7. Setting Cognito
            CognitoUserInfo userInfo = createCognitoUserInfo(tenant, language.getLanguageCode());
            String cognitoUserName = executeSettingCognito(userInfo);

            String message = getMessage(Constants.TENANTS_MESSAGE_SUCCESS);

            // 8. Call batch settingEnvironment
            if(!callBatchSettingEnvironment(tenantId, language)){
                log.warn("API ReceiveSettingRequest: Active Batch SettingEnvironment Failure!");
                message = getMessage(Constants.INTERRUPT_API);
            }

            // build response
            String loginUrl = String.format("%s/%s/account/login",
                    cognitoProperties.getCallBackUrl(), tenant.getTenantName());
            ReceiveSettingInfoDTO receiveSettingInfoDTO = new ReceiveSettingInfoDTO();
            receiveSettingInfoDTO.setMessage(message);
            receiveSettingInfoDTO.setTenantId(tenant.getTenantId());
            receiveSettingInfoDTO.setTenantName(tenant.getTenantName());
            receiveSettingInfoDTO.setUrlLogin(loginUrl);
            receiveSettingInfoDTO.setUserName(cognitoUserName);

            return new ContractSiteResponseDTO(SUCCESS.getValue(), receiveSettingInfoDTO, null /* errors */);
        } catch (Exception e) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API,
                e.getMessage());
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }
    }

    /**
     * Call batch setting environment
     *
     * @param tenantId id of tenant will setting
     * @param language language tenants chosen
     */
    private boolean callBatchSettingEnvironment(Long tenantId, LanguagesDTO language) {
        List<KeyValuePair> environments = new ArrayList<>();
        environments.add(new KeyValuePair().withName("BATCH_NAME").withValue("settingEnvironment"));
        environments.add(new KeyValuePair().withName("TENANT_ID").withValue(tenantId.toString()));
        environments.add(new KeyValuePair().withName("LANGUAGE_ID").withValue(language.getLanguageId().toString()));

        AwsVpcConfiguration vpcConfig = new AwsVpcConfiguration()
                .withSubnets(awsEcsConfigProperties.getVpcSubnet())
                .withSecurityGroups(awsEcsConfigProperties.getVpcSecurityGroup());

        return AwsRunTaskUtil.runAwsFargateTask(
                awsEcsConfigProperties.getCluster(),
                awsEcsConfigProperties.getBatchTaskName(),
                awsEcsConfigProperties.getBatchContainerName(),
                vpcConfig,
                "api_receiveSettingRequest",
                environments);
    }

    /**
     * Insert data tenants
     *
     * @param settingResDTO {@link} ReceiveSettingResDTO}
     * @param businessDTO {@link TenantReceiveServicesDTO}
     * @param industryDTO {@link IndustryDTO}
     * @param tenantUserId : userId update
     * @return Long : Tenant Id insert
     */
    private TenantReceiveServicesDTO insertDataTenant(ReceiveSettingResDTO settingResDTO, ReceiveCustomersBusinessDTO businessDTO,
            IndustryDTO industryDTO, Long tenantUserId) {
        boolean result = false;
        TenantReceiveServicesDTO dto = new TenantReceiveServicesDTO();
        String tenantNameRanDom = null;
        // Data exists tenants name random new tenants name
        while (!result) {
            // create random 12 character tenants Name
            tenantNameRanDom = TenantUtil.generateStringRandom(12);
            // Check exists name tenant
            if (!commonService.isExistTenant(tenantNameRanDom, null)) {
                result = true;
            }
        }
        dto.setCompanyName(settingResDTO.getCompanyName());
        dto.setMIndustryId(industryDTO.getMIndustryId());
        // Status value 1 ※未作成
        dto.setCreationStatus(TenantCreationStatus.NOT_CREATE.getValue());
        // Contract Status value 1:起動、2:停止、3:削除
        dto.setContractStatus(settingResDTO.getContractStatus());
        dto.setIsActive(true);
        dto.setContractId(settingResDTO.getContractTenantId());
        // 試用終了日の形式がYYYY/MM/DD
        if (settingResDTO.getTrialEndDate() != null) {
            dto.setTrialEndDate(DateUtil.toDate(settingResDTO.getTrialEndDate(), DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH));
        }
        dto.setEmail(settingResDTO.getEmail());
        dto.setTenantName(tenantNameRanDom);
        dto.setDepartmentName(settingResDTO.getDepartmentName());
        dto.setPositionName(settingResDTO.getPositionName());
        dto.setEmployeeName(settingResDTO.getEmployeeName());
        dto.setEmployeeSurname(settingResDTO.getEmployeeSurname());
        dto.setTelephoneNumber(settingResDTO.getTelephoneNumber());
        dto.setPassword(settingResDTO.getPassword());
        dto.setAccountClosingMonth(settingResDTO.getAccountClosingMonth());
        dto.setProductName(settingResDTO.getProductName());
        dto.setCustomerName(settingResDTO.getCustomerName());
        dto.setCalendarDay(settingResDTO.getCalendarDay());
        if (businessDTO.getCustomerBusinessParent() != null) {
            dto.setBusinessMainId(businessDTO.getCustomerBusinessParent());
        }

        if (businessDTO.getCustomerBusinessId() != null) {
            dto.setBusinessSubId(businessDTO.getCustomerBusinessId());
        }
        dto.setUpdatedUser(tenantUserId);
        dto.setCreatedUser(tenantUserId);
        // 3.2 Insert tenant
        Tenants tenants = tenantsRepository.save(tenantsMapper.toEntity(dto));
        return tenantsMapper.toDto(tenants);
    }

    /**
     * Insert data license packages
     *
     * @param settingResDTO {@link ReceiveSettingResDTO}
     * @param tenantId : tenant id insert
     * @param tenantUserId : userId update
     */
    private void insertDataLicensePackages(ReceiveSettingResDTO settingResDTO, long tenantId, Long tenantUserId) {
        List<LicensePackages> licensePackages = new ArrayList<>();
        for (ReceiveSettingPackagesDTO packagesData : settingResDTO.getPackages()) {
            LicensePackages packagesEntity = new LicensePackages();
            packagesEntity.setMPackageId(packagesData.getPackageId());
            packagesEntity.setTenantId(tenantId);
            packagesEntity.setAvailableLicenseNumber(packagesData.getAvailablePackageNumber());
            packagesEntity.setCreatedUser(tenantUserId);
            packagesEntity.setUpdatedUser(tenantUserId);
            licensePackages.add(packagesEntity);
        }

        licensePackagesRepository.saveAll(licensePackages);
    }

    /**
     * Validate receive setting request All
     *
     * @param requestDataDTO {@link ReceiveSettingResDTO}
     * @return List of error
     */
    private List<ContractSiteErrorDataDTO> validateReceiveSettingRequestAll(ReceiveSettingResDTO requestDataDTO) {
        // 1. Validate parameter not null
        List<ContractSiteErrorDataDTO> errors = validateParamRequest(requestDataDTO);

        // Validate email format
        if (!CheckUtil.isMailAddress(requestDataDTO.getEmail())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.EMAIL_INVALID_CODE,
                getMessage(Constants.EMAIL_INVALID_CODE)));
        }

        // format YYYY/MM/DD
        if (!StringUtils.isEmpty(requestDataDTO.getTrialEndDate())
                && !isDateFormat(requestDataDTO.getTrialEndDate(), DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.DATE_INVALID_CODE,
                    getMessage(Constants.DATE_INVALID_CODE)));
        }

        // Validate type value Integer: usedPackage
        errors.addAll(validateReceiveTypeInteger(requestDataDTO.getPackages()));

        // Validate contract status value: contractStatus only accepts status "起動"
        if (requestDataDTO.getContractStatus() != null
                && requestDataDTO.getContractStatus().compareTo(STATUS_START_UP) != 0) {
            errors.add(new ContractSiteErrorDataDTO(Constants.STATUS_NOT_STARTUP,
                    getMessage(Constants.STATUS_NOT_STARTUP, STATUS_START_UP)));
        }

        // validate password format
        Optional.ofNullable(validatePasswordFormat(requestDataDTO.getPassword(), requestDataDTO.getEmail()))
            .ifPresent(errors::add);

        return errors;
    }

    /**
     * Validate career business.
     *
     * @param schemaName : Schema name in Database connect.
     * @param businessMain : String business Main
     * @param businessSub : String business Sub
     * @return Receive customers business {@link ReceiveCustomersBusinessDTO}
     */
    private ReceiveCustomersBusinessDTO findCustomerBusiness(String schemaName,
            String businessMain, String businessSub) {
        try {
            String localBusinessMain = businessMain;
            String localBusinessSub = businessSub;
            if (StringUtils.isBlank(businessMain)) {
                localBusinessMain = DEFAULT_BUSINESS_MAIN;
            }
            if (StringUtils.isBlank(businessSub)) {
                localBusinessSub = DEFAULT_BUSINESS_SUB;
            }

            String customerBusinessName = String.format("'%s', '%s'", localBusinessMain, localBusinessSub);
            List<ReceiveCustomersBusinessDTO> businessDTOs = postgresRepository
                .getListCustomersBusiness(PARAM_CUSTOMERS_DB_NAME, schemaName, customerBusinessName);
            if (!CollectionUtils.isNullOrEmpty(businessDTOs) && businessDTOs.size() == 2) {
                // get a collection of all the ids.
                List<Long> customerBusinessParent = businessDTOs.stream()
                    .map(ReceiveCustomersBusinessDTO::getCustomerBusinessParent).collect(Collectors.toList());
                customerBusinessParent.remove((long) 0);
                if (!CollectionUtils.isNullOrEmpty(customerBusinessParent) && customerBusinessParent.size() == 1) {
                    for (ReceiveCustomersBusinessDTO customersBusinessDTO : businessDTOs) {
                        if(customersBusinessDTO.getCustomerBusinessParent() != null && customersBusinessDTO.getCustomerBusinessParent() != 0) {
                            return customersBusinessDTO;
                        }
                    }
                }
            }
        } catch (SQLException e) {
            throw new CustomException(e.getMessage());
        }
        return null;
    }

    /**
     * validate parameter request not null.
     *
     * @param resDTO {@link ReceiveSettingResDTO}
     * @return List errors
     */
    private List<ContractSiteErrorDataDTO> validateParamRequest(ReceiveSettingResDTO resDTO) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        // 1.1 validate internal
        if (StringUtils.isEmpty(resDTO.getIndustryTypeName())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_INDUSTRY_TYPE_NAME)));
        }

        if (StringUtils.isEmpty(resDTO.getContractTenantId())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_CONTRACT_ID)));
        }

        if (StringUtils.isEmpty(resDTO.getCompanyName())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_COMPANY_NAME)));
        }

        if (resDTO.getContractStatus() == null) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_CONTRACT_STATUS)));
        }

        if (StringUtils.isEmpty(resDTO.getEmail())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, EMAIL)));
        }

        if (StringUtils.isEmpty(resDTO.getDepartmentName())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_DEPARTMENT_NAME)));
        }

        if (StringUtils.isEmpty(resDTO.getEmployeeSurname())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_EMPLOYEE_SURNAME)));
        }

        if (StringUtils.isEmpty(resDTO.getCustomerName())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_CUSTOMER_NAME)));
        }

        // validate packages in param dto
        errors.addAll(validatePackageParamRequest(resDTO));
        return errors;
    }

    /**
     * validate parameter request not null.
     *
     * @param resDTO {@link ReceiveSettingResDTO}
     * @return List errors
     */
    private List<ContractSiteErrorDataDTO> validatePackageParamRequest(ReceiveSettingResDTO resDTO) {

        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();
        if (resDTO.getPackages() == null) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGE)));
        }

        for (ReceiveSettingPackagesDTO packagesDTO : resDTO.getPackages()) {
            if (packagesDTO.getPackageId() == null || packagesDTO.getAvailablePackageNumber() == null) {
                errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, PARAM_PACKAGE_ID)));
            }
        }
        return errors;
    }

    /**
     * Validate receive type value of Integer.
     *
     * @param packagesDTOs List {@link ReceiveSettingResDTO}
     * @return List errors
     */
    private List<ContractSiteErrorDataDTO> validateReceiveTypeInteger(List<ReceiveSettingPackagesDTO> packagesDTOs) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();
        for (ReceiveSettingPackagesDTO packagesDTO : packagesDTOs) {
            if (!packagesDTO.getPackageId().toString().matches(REGEX_INTEGER)) {
                errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, PARAM_USER_PACKAGE)));
            }

        }
        return errors;
    }

    /**
     * Get language from common service.
     *
     * @param paramLang param language
     * @param tenantName name of tenant
     * @return {@link LanguagesDTO} if exist. Otherwise return ja_jp.
     */
    private LanguagesDTO getLanguage(String paramLang, String tenantName) {
        if (StringUtils.isAllEmpty(paramLang)) {
            paramLang = ConstantsTenants.DEFAULT_LANG;
        }

        // call api get language
        try {
            List<LanguagesDTO> languagesDTOs = tenantRestOperationUtil.getLanguages(tenantName);
            if (CollectionUtils.isNullOrEmpty(languagesDTOs)) {
                return null;
            }
            for (LanguagesDTO dto : languagesDTOs) {
                if (dto.getLanguageCode().equals(paramLang)) {
                    return dto;
                }
            }
        } catch (CustomRestException | IllegalStateException e) {
            log.error("Call API get-language failed. Message = {}", e.getMessage());
        }
        return null;
    }

    /**
     * Create Cognito user info
     *
     * @param tenant tenant
     * @param langCode lang code
     * @return {@link CognitoUserInfo}
     */
    private CognitoUserInfo createCognitoUserInfo(TenantReceiveServicesDTO tenant, String langCode) {
        CognitoUserInfo userInfo = new CognitoUserInfo();
        userInfo.setTenantId(tenant.getTenantId());
        userInfo.setTenantName(tenant.getTenantName());
        userInfo.setUsername(tenant.getEmail());
        userInfo.setPassword(tenant.getPassword());
        userInfo.setEmail(tenant.getEmail());
        userInfo.setEmployeeName(tenant.getEmployeeName());
        userInfo.setEmployeeSurname(tenant.getEmployeeSurname());
        userInfo.setLanguageCode(langCode);
        userInfo.setUpdatedAt(Instant.now().toEpochMilli());
        userInfo.setIsAdmin(true);
        userInfo.setIsModifyEmployee(false);
        userInfo.setIsAccessContract(true);
        userInfo.setTimezoneName(TIME_ZONE);
        userInfo.setFormatDate(FORMAT_DATE);
        userInfo.setResetCode(StringUtils.EMPTY);
        userInfo.setCompanyName(tenant.getCompanyName());
        return userInfo;
    }

    /**
     * Setting Cognito
     *
     * @param userInfo The CognitoUserInfo object
     * @return username in Cognito
     */
    private String executeSettingCognito(CognitoUserInfo userInfo){
        String tenantName = userInfo.getTenantName();

        // create user pool
        String userPoolId = authenticationService.createUserPool(tenantName);
        if (StringUtils.isBlank(userPoolId)) {
            throw new IllegalStateException("Create user pool failed!");
        }

        String clientId = null;
        try {
            // create user pool domain
            authenticationService.createUserPoolDomain(userPoolId, tenantName);

            // create user pool client
            clientId = authenticationService.createUserPoolClient(userPoolId, tenantName, null);
            if (StringUtils.isBlank(clientId)) {
                authenticationService.deleteUserPool(userPoolId, null, tenantName);
                throw new IllegalStateException("Create user pool client failed!");
            }

            // save cognito setting info
            CognitoSettingsDTO cognitoSettingsDTO = new CognitoSettingsDTO();
            cognitoSettingsDTO.setTenantId(userInfo.getTenantId());
            cognitoSettingsDTO.setUserPoolId(userPoolId);
            cognitoSettingsDTO.setClientId(clientId);
            cognitoSettingsDTO.setIsApp(false);
            cognitoSettingsDTO.setIsPc(false);

            Long userId = getUserIdFromToken();
            Instant now = Instant.now();
            cognitoSettingsDTO.setCreatedUser(userId);
            cognitoSettingsDTO.setCreatedDate(now);
            cognitoSettingsDTO.setUpdatedUser(userId);
            cognitoSettingsDTO.setUpdatedDate(now);
            cognitoSettingsService.save(cognitoSettingsDTO);

            // create user group
            authenticationService.createUserGroup(userPoolId);

            // create user
            AdminCreateUserResponse createUserResponse = authenticationService.createUser(userPoolId, userInfo);
            if (createUserResponse == null) {
                throw new IllegalStateException("Create user failed!");
            }

            // add user to group
            authenticationService.addUserToGroup(userPoolId, userInfo.getUsername());
            return createUserResponse.user().username();
        } catch (Exception e) {
            authenticationService.deleteUserPool(userPoolId, clientId, tenantName);
            throw e;
        }
    }

    /**
     * Check validate Datetime
     *
     * @param target String format
     * @param formatter yyyy/MM/dd
     * @return Correct format yyyy/MM/dd true, otherwise False
     */
    private boolean isDateFormat(String target, String formatter) {
        SimpleDateFormat sdf = new SimpleDateFormat(formatter);
        try {
            sdf.parse(target);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }
}
