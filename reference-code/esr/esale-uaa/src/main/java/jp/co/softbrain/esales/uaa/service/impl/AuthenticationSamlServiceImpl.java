package jp.co.softbrain.esales.uaa.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomGraphQLException;
import jp.co.softbrain.esales.uaa.config.ApplicationProperties;
import jp.co.softbrain.esales.uaa.config.ConstantsUaa;
import jp.co.softbrain.esales.uaa.domain.AuthenticationSaml;
import jp.co.softbrain.esales.uaa.repository.AuthenticationSamlRepository;
import jp.co.softbrain.esales.uaa.security.SecurityUtils;
import jp.co.softbrain.esales.uaa.service.AuthenticationSamlService;
import jp.co.softbrain.esales.uaa.service.dto.AuthenticationSamlDTO;
import jp.co.softbrain.esales.uaa.service.dto.AuthenticationSamlInDTO;
import jp.co.softbrain.esales.uaa.service.dto.GetAuthenticationSAMLDTO;
import jp.co.softbrain.esales.uaa.service.dto.ReferenceFieldDTO;
import jp.co.softbrain.esales.uaa.service.dto.UpdateAuthenticationSAMLOutDTO;
import jp.co.softbrain.esales.uaa.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.uaa.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.uaa.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.uaa.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.uaa.service.mapper.AuthenticationSamlMapper;
import jp.co.softbrain.esales.uaa.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.StringUtil;

/**
 * Service Implementation for managing {@link AuthenticationSaml}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class AuthenticationSamlServiceImpl implements AuthenticationSamlService {

    private final AuthenticationSamlRepository authenticationSamlRepository;

    private final AuthenticationSamlMapper authenticationSamlMapper;

    private static final String USER_DOES_NOT_HAVE_PERMISSION = "User does not have permission.";

    public static final Integer FIELD_BELONG_EMPLOYEE = 8;

    public static final String USER_ID = "userId";

    private static final Long NUMBER_ZERO = 0L;

    private static final String UPDATE_AUTHENCATION_SAML = "updateAuthenticationSAML";

    private static final String VALIDATE_FAIL = "Validate failded.";

    private static final String URL_API_GET_CUSTOM_FIELD_INFO = "get-custom-fields-info";

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private AuthenticationSamlService authenticationSamlService;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public AuthenticationSamlServiceImpl(AuthenticationSamlRepository authenticationSamlRepository,
            AuthenticationSamlMapper authenticationSamlMapper) {
        this.authenticationSamlRepository = authenticationSamlRepository;
        this.authenticationSamlMapper = authenticationSamlMapper;
    }

    /*
     * @see jp.co.softbrain.esales.uaa.service
     * AuthenticationSamlService#save(authenticationSamlDTO)
     */
    @Override
    public AuthenticationSamlDTO save(AuthenticationSamlDTO authenticationSamlDTO) {
        AuthenticationSaml authenticationSaml = authenticationSamlMapper.toEntity(authenticationSamlDTO);
        authenticationSaml = authenticationSamlRepository.save(authenticationSaml);
        return authenticationSamlMapper.toDto(authenticationSaml);
    }

    /*
     * @see jp.co.softbrain.esales.uaa.service
     * AuthenticationSamlService#findOne(id)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<AuthenticationSamlDTO> findAll() {
        return authenticationSamlRepository.findAll().stream().map(authenticationSamlMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /*
     * @see jp.co.softbrain.esales.uaa.service
     * AuthenticationSamlService#findOne(id)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<AuthenticationSamlDTO> findOne(Long id) {
        return authenticationSamlRepository.findById(id).map(authenticationSamlMapper::toDto);
    }

    /*
     * @see jp.co.softbrain.esales.uaa.service
     * AuthenticationSamlService#delete(id)
     */
    @Override
    public void delete(Long id) {
        authenticationSamlRepository.deleteById(id);
    }

    /**
     * @param files get from S3
     * @return fileName formated
     */
    private String formatFileName(List<MultipartFile> attachmentParts) {
        if (attachmentParts == null || attachmentParts.isEmpty()) {
            return null;
        }
        return attachmentParts.get(0).getOriginalFilename();
    }

    /**
     * This is method validate Parameter when authencationSaml
     *
     * @param data data update
     */
    private void validateParameter(AuthenticationSamlInDTO data) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("referenceValue", data.getReferenceValue());
        fixedParams.put("issuer", data.getIssuer());
        fixedParams.put("urlLogin", data.getUrlLogin());
        fixedParams.put("urLogout", data.getUrLogout());
        fixedParams.put("certificateData", data.getCertificateData());
        fixedParams.put("certificateName", data.getCertificateName());
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        // json for validate common and call method validate common
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateResponse validateResponse = restOperationUtils.executeCallApi(
                Constants.PathEnum.COMMONS, "validate", HttpMethod.POST, validateJson,
                ValidateResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (validateResponse.getErrors() != null && !validateResponse.getErrors().isEmpty()) {
            throw new CustomGraphQLException(VALIDATE_FAIL, validateResponse.getErrors());
        }
        if (Constants.RESPONSE_FAILED == validateResponse.getStatus()) {
            List<Map<String, Object>> dataError = validateResponse.getErrors();
            if (!dataError.isEmpty()) {
                throw new CustomGraphQLException(ConstantsUaa.VALIDATE_MSG_FAILED, dataError);
            }
        }
    }

    /**
     * inserUpdateSaml : insert and Update Saml
     *
     * @param data
     * @param certificatePath
     * @param certificateName
     */
    private Long inserUpdateSaml(AuthenticationSamlInDTO data, String certificatePath, String certificateName) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        UpdateAuthenticationSAMLOutDTO reponseOut = new UpdateAuthenticationSAMLOutDTO();
        if (data.getSamlId() == null || data.getSamlId().equals(NUMBER_ZERO)) {
            AuthenticationSamlDTO samDTO = authenticationSamlMapper.toAuthenticationSamlDTO(data);
            samDTO.setSamlId(null);
            samDTO.setCreatedUser(employeeId);
            samDTO.setUpdatedUser(employeeId);
            samDTO.setCertificatePath(certificatePath);
            samDTO.setCertificateName(certificateName);
            reponseOut.setSamlId(authenticationSamlService.save(samDTO).getSamlId());
        } else {
            AuthenticationSamlDTO predicate = this.findOne(data.getSamlId()).orElse(null);
            if (predicate == null || !predicate.getUpdatedDate().equals(data.getUpdatedDate())) {
                throw new CustomGraphQLException("error-exclusive", UPDATE_AUTHENCATION_SAML, Constants.EXCLUSIVE_CODE);
            }
            predicate = authenticationSamlMapper.toAuthenticationSamlDTO(data);
            predicate.setUpdatedUser(employeeId);
            predicate.setCertificatePath(certificatePath);
            predicate.setCertificateName(certificateName);
            reponseOut.setSamlId(authenticationSamlService.save(predicate).getSamlId());
        }
        return reponseOut.getSamlId();
    }

    /*
     * @see jp.co.softbrain.esales.uaa.service
     * AuthenticationSamlService#updateAuthenticationSAML(data, files)
     */
    @Override
    @Transactional
    public UpdateAuthenticationSAMLOutDTO updateAuthenticationSAML(AuthenticationSamlInDTO data,
            List<MultipartFile> files) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        UpdateAuthenticationSAMLOutDTO reponseOut = new UpdateAuthenticationSAMLOutDTO();
        // 1. check permission
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomGraphQLException(USER_DOES_NOT_HAVE_PERMISSION, USER_ID, Constants.USER_NOT_PERMISSION);
        }
        // 2. validate common
        validateParameter(data);
        String certificatePath = null;
        String certificateName = null;
        try {
            // 3. Get path file before update\
            if (!data.getSamlId().equals(NUMBER_ZERO)) {
                String pathFile = authenticationSamlRepository.findBySamlId(data.getSamlId()).getCertificatePath();
                // 4. Call API uploadFiles
                // check for file exist
                if (data.getIsDeleteImage() != null && data.getIsDeleteImage()
                        && !StringUtil.isEmpty(data.getCertificateData())) {
                    S3CloudStorageClient.deleteObject(applicationProperties.getUploadBucket(),
                            data.getCertificateData());
                    data.setCertificateName(null);
                    data.setCertificateData(null);
                }

                Map<String, String> fileAdd = this.copyFileToS3(employeeId, files);
                if (fileAdd != null && !fileAdd.isEmpty()) {
                    Map.Entry<String, String> entry = fileAdd.entrySet().iterator().next();
                    certificateName = formatFileName(files);
                    certificatePath = entry.getValue();
                }
                // 5.1 Insert SAML
                Long id = inserUpdateSaml(data, certificatePath, certificateName);
                reponseOut.setSamlId(id);
                // 6. delete file
                if (!StringUtil.isEmpty(pathFile) && !NUMBER_ZERO.equals(data.getSamlId()))
                    S3CloudStorageClient.deleteObject(applicationProperties.getUploadBucket(), pathFile);
            }

        } catch (Exception ex) {
            if (!StringUtil.isEmpty(certificatePath))
                S3CloudStorageClient.deleteObject(applicationProperties.getUploadBucket(), certificatePath);
        }
        // 7.create response
        return reponseOut;
    }

    /**
     * copy file to s3 : copy file to s3 for uploadfile
     *
     * @param employeeId : id of employee
     * @param files : file upload
     * @return : Map String
     */
    private Map<String, String> copyFileToS3(Long employeeId, List<MultipartFile> attachmentParts) {
        if (attachmentParts == null || attachmentParts.isEmpty()) {
            return null;
        }

        String bucketName = applicationProperties.getUploadBucket();
        if (!attachmentParts.isEmpty()) {
            return S3CloudStorageClient.uploadFiles(employeeId, jwtTokenUtil.getTenantIdFromToken(), bucketName,
                    Constants.FieldBelong.PRODUCT.name().toLowerCase(), attachmentParts);
        }

        return null;
    }

    /*
     * @see jp.co.softbrain.esales.uaa.service
     * AuthenticationSamlService#getAuthenticationSAML()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetAuthenticationSAMLDTO getAuthenticationSAML() {
        // 1. Get authentication SAML
        GetAuthenticationSAMLDTO response = new GetAuthenticationSAMLDTO();
        List<AuthenticationSamlDTO> authenticationSAML = authenticationSamlService.findAll();

        // 2. Get list of items connective
        // 2.1. Call API getCustomFieldsInfo
        String token = SecurityUtils.getTokenValue().orElse(null);
        GetCustomFieldsInfoRequest commonFieldInfoRequest = new GetCustomFieldsInfoRequest();
        commonFieldInfoRequest.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                URL_API_GET_CUSTOM_FIELD_INFO, HttpMethod.POST, commonFieldInfoRequest, CommonFieldInfoResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        List<ReferenceFieldDTO> dtos = new ArrayList<>();
        if (fieldInfoResponse != null) {
            List<CustomFieldsInfoOutDTO> customFieldsInfo = fieldInfoResponse.getFieldInfoCustoms();
            for (CustomFieldsInfoOutDTO fields : customFieldsInfo) {
                if (createReferenceField(fields)) {
                    ReferenceFieldDTO dto = new ReferenceFieldDTO();
                    dto.setFieldId(fields.getFieldId());
                    dto.setFieldLabel(fields.getFieldLabel());
                    dtos.add(dto);
                }
            }
        }
        // 2.2 create reponse
        response.setSaml(authenticationSAML.get(0));
        response.setReferenceField(dtos);
        return response;
    }

    /**
     * createReferenceField : Create Array Reference Field
     *
     * @param field : field
     */
    private boolean createReferenceField(CustomFieldsInfoOutDTO field) {
        Boolean isDefault = field.getIsDefault() == null ? null : field.getIsDefault();
        return ((Boolean.FALSE.equals(isDefault)
                && FieldTypeEnum.TEXT.getCode().equals(String.valueOf(field.getFieldType())))
                || (Boolean.TRUE.equals(isDefault)
                        && ("employeeId".equals(field.getFieldName()) || "email".equals(field.getFieldName()))));

    }
}
