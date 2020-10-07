package jp.co.softbrain.esales.tenants.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.util.StringUtils;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.ApplicationProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.config.oauth2.CognitoProperties;
import jp.co.softbrain.esales.tenants.domain.AuthenticationSaml;
import jp.co.softbrain.esales.tenants.domain.CognitoSettings;
import jp.co.softbrain.esales.tenants.domain.Tenants;
import jp.co.softbrain.esales.tenants.repository.AuthenticationSamlRepository;
import jp.co.softbrain.esales.tenants.repository.CognitoSettingsRepository;
import jp.co.softbrain.esales.tenants.repository.TenantsRepository;
import jp.co.softbrain.esales.tenants.security.SecurityUtils;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CognitoSettingsService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingsDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateCognitoInDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateCognitoOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.UserPoolDTO;
import jp.co.softbrain.esales.tenants.service.mapper.CognitoSettingsMapper;
import jp.co.softbrain.esales.tenants.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.tenants.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.tenants.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;
import jp.co.softbrain.esales.utils.dto.commons.ValidateResponse;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateIdentityProviderRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DeleteIdentityProviderRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DuplicateProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ExplicitAuthFlowsType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.IdentityProviderTypeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InvalidParameterException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.OAuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UpdateIdentityProviderRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UpdateUserPoolClientRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameAttributeType;

/**
 * Service Implementation for managing {@link CognitoSettings}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CognitoSettingsServiceImpl extends AbstractTenantService implements CognitoSettingsService {

    private final Logger log = LoggerFactory.getLogger(CognitoSettingsServiceImpl.class);

    private final CognitoSettingsRepository cognitoSettingsRepository;

    private final CognitoSettingsMapper cognitoSettingsMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ApplicationProperties applicationProperties;

    public static final String USER_ID = "userId";

    private static final String FILE_NAME = "file_name";

    private static final String USER_DOES_NOT_HAVE_PERMISSION = "User does not have permission.";

    private static final Long NUMBER_ZERO = 0L;

    private static CognitoIdentityProviderClient mIdentityProvider = null;

    private static final String META_DATA = "metaData";

    private final CognitoProperties cognitoProperties;

    private static final Integer REFRESH_TOKEN_VALIDITY = 30;

    public CognitoSettingsServiceImpl(CognitoSettingsRepository cognitoSettingsRepository,
            CognitoSettingsMapper cognitoSettingsMapper, CognitoProperties cognitoProperties) {
        this.cognitoSettingsRepository = cognitoSettingsRepository;
        this.cognitoSettingsMapper = cognitoSettingsMapper;
        this.cognitoProperties = cognitoProperties;
        if (mIdentityProvider == null) {
            mIdentityProvider = getAmazonCognitoIdentityClient();
        }
    }

    @Autowired
    private TenantsRepository tenantsRepository;

    @Autowired
    private CommonService commonService;

    @Autowired
    AuthenticationSamlRepository authenticationSamlRepository;

    /**
     * Build an DefaultCredentialsProvider object from the ID and secret key.
     *
     * @return an DefaultCredentialsProvider object, initialized with the ID and
     *         Key.
     */
    protected DefaultCredentialsProvider getCredentials() {
        return DefaultCredentialsProvider.create();
    }

    /**
     * Build an AWS cognito identity provider, based on the parameters defined
     * in the CognitoResources interface.
     *
     * @return
     */
    protected CognitoIdentityProviderClient getAmazonCognitoIdentityClient() {
        return CognitoIdentityProviderClient.builder().credentialsProvider(getCredentials())
                .region(Region.of(cognitoProperties.getSignatureVerification().getRegion())).build();
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service.CognitoSettingsService#save(jp.co.softbrain.esales.tenants.service.dto.CognitoSettingsDTO)
     */
    @Override
    public CognitoSettingsDTO save(CognitoSettingsDTO cognitoSettingsDTO) {
        log.debug("Request to save CognitoSettings : {}", cognitoSettingsDTO);
        CognitoSettings cognitoSettings = cognitoSettingsMapper.toEntity(cognitoSettingsDTO);
        cognitoSettings.setUpdatedUser(getUserIdFromToken());
        cognitoSettings = cognitoSettingsRepository.save(cognitoSettings);
        return cognitoSettingsMapper.toDto(cognitoSettings);
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service.CognitoSettingsService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CognitoSettingsDTO> findAll() {
        log.debug("Request to get all CognitoSettings");
        return cognitoSettingsRepository.findAll().stream().map(cognitoSettingsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service.CognitoSettingsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<CognitoSettingsDTO> findOne(Long id) {
        log.debug("Request to get CognitoSettings : {}", id);
        return cognitoSettingsRepository.findByCognitoSettingsId(id).map(cognitoSettingsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service.CognitoSettingsService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete CognitoSettings : {}", id);
        cognitoSettingsRepository.deleteByCognitoSettingsId(id);
    }

    /**
     * @see CognitoSettingsService#getCognitoSetting()
     */
    @Override
    public CognitoSettingInfoDTO getCognitoSetting() {
        // validate parameter
        String tenantName = TenantContextHolder.getTenant();
        if (StringUtils.isNullOrEmpty(tenantName)) {
            throw new CustomException(getMessage(Constants.REQUIRED_PARAMETER, ConstantsTenants.TENANT_ITEM),
                    ConstantsTenants.TENANT_ITEM, Constants.REQUIRED_PARAMETER);
        }

        // Get cognito setting
        return commonService
                .getCognitoSettingTenant(tenantName, null /* contractTenantId */)
                .orElseThrow(() -> new CustomException(getMessage(Constants.ITEM_NOT_EXIST, "Cognito setting"),
                        "Cognito setting", Constants.ITEM_NOT_EXIST));
    }

    /**
     * @see jp.co.softbrain.esgetales.tenants.service.CognitoSettingsService#getUserPool()
     */
    @Override
    public UserPoolDTO getUserPool() {
        UserPoolDTO response = null;
        String tenantName = TenantContextHolder.getTenant();
        Tenants tenantInfo = tenantsRepository.findByTenantName(tenantName).orElse(null);
        if (tenantInfo != null) {
            CognitoSettings cognitoSetting = cognitoSettingsRepository
                    .findByTenantIdOrderByCognitoSettingsIdDesc(tenantInfo.getTenantId()).get(0);
            AuthenticationSaml authSaml = authenticationSamlRepository.findByTenantId(tenantInfo.getTenantId());
            if (cognitoSetting != null && authSaml != null) {
                response = new UserPoolDTO();
                response.setTenantId(cognitoSetting.getTenantId());
                response.setClientId(cognitoSetting.getClientId());
                response.setUserPoolId(cognitoSetting.getUserPoolId());
                response.setIsPc(authSaml.getIsPc());
                response.setIsApp(authSaml.getIsApp());
                response.setIssuer(authSaml.getIssuer());
            }
        }
        return response;
    }

    /**
     * validateRequired : validate required
     *
     * @param data : data parameter
     */
    private void validateRequired(UpdateCognitoInDTO data, List<MultipartFile> file) {
        if (data.getCognitoSettingsId() == null) {
            throw new CustomRestException("param [cognitoSettingsId] is null",
                    CommonUtils.putError("cognitoSettingsId", Constants.RIQUIRED_CODE));
        }
        if ((file == null && StringUtils.isNullOrEmpty(data.getMetaDataName()))
                || (file != null && file.isEmpty() && Boolean.TRUE.equals(data.getFileStatus()))) {
            throw new CustomException("No files uploaded", META_DATA, Constants.RIQUIRED_CODE);
        }
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service
     *      CognitoSettingsService#updateCognitoSetting(jp.co.softbrain.esales.tenants.service.dto.UpdateCognitoInDTO,
     *      List<jp.co.softbrain.esales.utils.dto.FileMappingDTO>)
     */
    @Override
    public UpdateCognitoOutDTO updateCognitoSetting(UpdateCognitoInDTO data, List<MultipartFile> metaData,
            List<String> filesMap) {
        List<FileMappingDTO> files = S3FileUtil.creatFileMappingList(metaData, filesMap);
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        UpdateCognitoOutDTO reponse = new UpdateCognitoOutDTO();

        // Validate required
        validateRequired(data, metaData);

        // 1. check permission
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(USER_DOES_NOT_HAVE_PERMISSION,
                    CommonUtils.putError(USER_ID, Constants.USER_NOT_PERMISSION));
        }
        // 2. validate common
        validateParameter(data);

        // validate file > 2MB
        if (Boolean.TRUE.equals(data.getFileStatus())) {
            validateFiles(metaData);
        }

        // 3. Get path file before update
        Optional<CognitoSettingsDTO> cognito = this.findOne(data.getCognitoSettingsId());
        String pathFile = null;
        FileInfosDTO fileInfosDTO = new FileInfosDTO();

        if (!NUMBER_ZERO.equals(data.getCognitoSettingsId()) && Boolean.TRUE.equals(data.getFileStatus())
                && cognito.isPresent()) {
            pathFile = cognito.get().getMetaDataPath();

            // 4. Call API uploadFiles
            Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(employeeId, files,
                    tenantName, applicationProperties.getUploadBucket(), FieldBelongEnum.TENANT);
            List<FileInfosDTO> listFile = new ArrayList<>();
            if (uploadData != null) {
                listFile = uploadData.get(0L).get(FILE_NAME);
            }

            if (listFile != null) {
                listFile.forEach(info -> fileInfosDTO.setFilePath(info.getFilePath()));
            }
        }

        // 5. Update cognito setting
        try {
            Long cognitoId = saveCognito(data, fileInfosDTO.getFilePath(), employeeId);
            reponse.setCognitoSettingsId(cognitoId);

            updateCognitoProvider(data, fileInfosDTO.getFilePath(), cognito);
        } catch (InvalidParameterException e) {
            S3CloudStorageClient.deleteObject(applicationProperties.getUploadBucket(), fileInfosDTO.getFilePath());
            log.error("Cannot create SAML Provider. Roll back SAML Provider!!");
            throw new CustomRestException("param [metaDataFile] is invalid",
                    CommonUtils.putError("metaDataFile", ConstantsTenants.META_FILE_INVALID));
        }

        // 6. delete file
        if (!StringUtil.isEmpty(pathFile) && Boolean.TRUE.equals(data.getFileStatus())
                && !NUMBER_ZERO.equals(data.getCognitoSettingsId())) {
            S3CloudStorageClient.deleteObject(applicationProperties.getUploadBucket(), pathFile);
        }

        // 7.create response
        return reponse;
    }

    /**
     * saveCognito : Update cognitoSetting
     *
     * @param data : data
     * @param metaDataPath : path file
     * @param employeeId : employee id
     * @return Long : cognitoSettingsId
     */
    private Long saveCognito(UpdateCognitoInDTO data, String metaDataPath, Long employeeId) {
        UpdateCognitoOutDTO response = new UpdateCognitoOutDTO();
        this.findOne(data.getCognitoSettingsId()).ifPresentOrElse(dto -> {
            dto.setUpdatedUser(employeeId);
            dto.setIsPc(data.getIsPc());
            dto.setIsApp(data.getIsApp());
            dto.setProviderName(data.getProviderName());
            dto.setReferenceValue(data.getReferenceValue());
            if (!StringUtils.isNullOrEmpty(data.getMetaDataName()) && !StringUtils.isNullOrEmpty(metaDataPath)
                    && Boolean.TRUE.equals(data.getFileStatus())) {
                dto.setMetaDataPath(metaDataPath);
                dto.setMetaDataName(data.getMetaDataName());
            }
            response.setCognitoSettingsId(this.save(dto).getCognitoSettingsId());
        }, () -> {
        });
        return response.getCognitoSettingsId();
    }

    /**
     * This is method validate Parameter when authencationSaml
     *
     * @param data data update
     */
    private void validateParameter(UpdateCognitoInDTO data) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("referenceValue", data.getReferenceValue());
        fixedParams.put("providerName", data.getProviderName());
        fixedParams.put("metaDataName", data.getMetaDataName());
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        // json for validate common and call method validate common

        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateResponse response = null;
        try {
            // Validate commons
            ValidateRequest validateRequest = new ValidateRequest(validateJson);
            response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, ConstantsTenants.URL_API_VALIDATE,
                    HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (RuntimeException e) {
            log.error(e.getLocalizedMessage());
        }
        if (response != null && response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsTenants.VALIDATE_MSG_FAILED, response.getErrors());
        }
    }

    private void updateCognitoProvider(UpdateCognitoInDTO data, String filePath, Optional<CognitoSettingsDTO> cognito) {
        if (!cognito.isPresent()) {
            return;
        }
        CognitoSettingsDTO cognitoSettings = cognito.get();


        if (StringUtils.isNullOrEmpty(filePath)) {
            filePath = cognitoSettings.getMetaDataPath();
        }
        
        Map<String, String> providerDetails = new HashMap<>();
        providerDetails.put("MetadataURL", S3CloudStorageClient.generatePresignedURL(
                applicationProperties.getUploadBucket(), filePath, applicationProperties.getExpiredSeconds()));
        providerDetails.put("IDPSignout", "true");

        Map<String, String> attributeMapping = new HashMap<>();
        attributeMapping.put(UsernameAttributeType.EMAIL.toString(), data.getReferenceValue());
        String providerName = data.getProviderName();
        String userPoolId = cognitoSettings.getUserPoolId();
        try {
            CreateIdentityProviderRequest createIdentityProviderRequest = CreateIdentityProviderRequest.builder()
                    .providerName(providerName).providerType(IdentityProviderTypeType.SAML.toString())
                    .providerDetails(providerDetails).attributeMapping(attributeMapping).userPoolId(userPoolId).build();
            mIdentityProvider.createIdentityProvider(createIdentityProviderRequest);
        } catch (DuplicateProviderException e) {
            UpdateIdentityProviderRequest updateIdentityProviderRequest = UpdateIdentityProviderRequest.builder()
                    .attributeMapping(attributeMapping).providerName(providerName).providerDetails(providerDetails)
                    .userPoolId(userPoolId).build();
            mIdentityProvider.updateIdentityProvider(updateIdentityProviderRequest);
        }

        updateUserPoolClient(providerName, cognitoSettings.getClientId(), userPoolId);

        if (StringUtils.hasValue(cognitoSettings.getProviderName())
                && !cognitoSettings.getProviderName().equals(data.getProviderName())) {
            try {
                DeleteIdentityProviderRequest deleteIdentityProviderRequest = DeleteIdentityProviderRequest.builder()
                        .providerName(cognitoSettings.getProviderName()).userPoolId(cognitoSettings.getUserPoolId())
                        .build();
                mIdentityProvider.deleteIdentityProvider(deleteIdentityProviderRequest);
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        }
    }

    private void updateUserPoolClient(String providerName, String clientId, String userPoolId) {
        String callBkacUrl = cognitoProperties.getCallBackUrl();
        String tenantId = TenantContextHolder.getTenant();
        String callBackClientUrl = String.format("%s/%s/", callBkacUrl, tenantId);
        String callBackLogoutUrl = String.format("%s/%s/account/logout", callBkacUrl, tenantId);
        UpdateUserPoolClientRequest updateUserPoolClientRequest = UpdateUserPoolClientRequest.builder()
                .allowedOAuthFlows(getAllowedOAuthFlows()).allowedOAuthScopes(getAllowedOAuthScopes())
                .explicitAuthFlows(getExplicitAuthFlows()).explicitAuthFlowsWithStrings(getExplicitAuthFlowsString())
                .supportedIdentityProviders(providerName).callbackURLs(callBackClientUrl).logoutURLs(callBackLogoutUrl)
                .refreshTokenValidity(REFRESH_TOKEN_VALIDITY).clientId(clientId).userPoolId(userPoolId).build();
        mIdentityProvider.updateUserPoolClient(updateUserPoolClientRequest);
    }

    /**
     * Validate file.
     *
     * @param files file information
     */
    private void validateFiles(List<MultipartFile> files) {
        long totalSize = 0;
        for (MultipartFile file : files) {
            if (org.apache.commons.lang.StringUtils.isNotEmpty(file.getOriginalFilename())) {
                totalSize += file.getSize();
            }
        }
        // Check the total file size > 2GB
        if (totalSize > Constants.FILE_SIZE_MAX) {
            throw new CustomRestException(ConstantsTenants.VALIDATE_MSG_FAILED,
                    CommonUtils.putError(META_DATA, Constants.FILE_OVER_SIZE));
        }
    }
    
    /**
     * get Allowed OAuth Flows
     *
     * @return
     */
    private List<OAuthFlowType> getAllowedOAuthFlows() {
        List<OAuthFlowType> allowedOAuthFlows = new ArrayList<>();
        allowedOAuthFlows.add(OAuthFlowType.CODE);
        allowedOAuthFlows.add(OAuthFlowType.IMPLICIT);
        return allowedOAuthFlows;
    }

    /**
     * Allowed OAuth Scopes
     *
     * @return
     */
    private List<String> getAllowedOAuthScopes() {
        List<String> allowedOAuthScopes = new ArrayList<>();
        allowedOAuthScopes.add(EMAIL);
        allowedOAuthScopes.add(OPENID);
        return allowedOAuthScopes;
    }

    /**
     * Auth Flows Configuration
     *
     * @return
     */
    private List<String> getExplicitAuthFlowsString() {
        List<String> explicitAuthFlowsString = new ArrayList<>();
        explicitAuthFlowsString.add("ALLOW_ADMIN_USER_PASSWORD_AUTH");
        explicitAuthFlowsString.add("ALLOW_USER_SRP_AUTH");
        explicitAuthFlowsString.add("ALLOW_REFRESH_TOKEN_AUTH");
        return explicitAuthFlowsString;
    }

    /**
     * Auth Flows Configuration
     *
     * @return
     */
    private List<ExplicitAuthFlowsType> getExplicitAuthFlows() {
        List<ExplicitAuthFlowsType> explicitAuthFlows = new ArrayList<>();
        explicitAuthFlows.add(ExplicitAuthFlowsType.CUSTOM_AUTH_FLOW_ONLY);
        return explicitAuthFlows;
    }
}
