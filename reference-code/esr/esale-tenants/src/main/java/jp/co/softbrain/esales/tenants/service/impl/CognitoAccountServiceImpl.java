package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.util.StringUtils;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.dto.CognitoAccountDTO;
import jp.co.softbrain.esales.tenants.service.CognitoAccountService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.dto.DeleteAccountCognitoResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.CreateAccountCognitoRequestDTO;
import jp.co.softbrain.esales.tenants.service.dto.CreateAccountCognitoResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateAccountCognitoInfo;
import jp.co.softbrain.esales.tenants.service.dto.UpdateAccountCognitoResponseDTO;
import jp.co.softbrain.esales.utils.EmailValidator;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminAddUserToGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminDeleteUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminSetUserPasswordRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ListUsersRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ListUsersResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.MessageActionType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserNotFoundException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserType;

/**
 * Service implementation for cognito account
 *
 * @author tongminhcuong
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CognitoAccountServiceImpl extends AbstractTenantService implements CognitoAccountService {

    private static final String CONTRACT_TENANT_ID_PARAM = "contractTenantId";
    private static final String USER_NAME_PARAM = "userName";

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private CognitoIdentityProviderClient mIdentityProvider;

    @Autowired
    private CommonService commonService;

    /**
     * @see CognitoAccountService#createAccountCognito(CreateAccountCognitoRequestDTO)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public ContractSiteResponseDTO createAccountCognito(CreateAccountCognitoRequestDTO accountCognitoDTO) {
        // 1. Validate request parameter
        List<ContractSiteErrorDataDTO> errors = validateCreateAccountCognitoParams(accountCognitoDTO);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        // 2. Get cognito setting
        CognitoSettingInfoDTO cognitoSettingInfo = commonService
                .getCognitoSettingTenant(null /* tenantName */, accountCognitoDTO.getContractTenantId())
                .orElse(null);
        if (cognitoSettingInfo == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, COGNITO_SETTING_PARAM));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 3. Create account cognito
        String userPoolId = cognitoSettingInfo.getUserPoolId();
        String tenantName = cognitoSettingInfo.getTenantName();

        List<AttributeType> userAttributes = new ArrayList<>();
        String email = accountCognitoDTO.getEmail();
        userAttributes.add(AttributeType.builder()
                .name(EMAIL).value(email).build());
        userAttributes.add(AttributeType.builder()
                .name(CUSTOM_EMPLOYEE_SURNAME).value(accountCognitoDTO.getEmployeeSurname()).build());
        userAttributes.add(AttributeType.builder()
                .name(CUSTOM_EMPLOYEE_NAME).value(accountCognitoDTO.getEmployeeName()).build());
        userAttributes.add(AttributeType.builder()
                .name(CUSTOM_LANGUAGE_CODE).value(ConstantsTenants.DEFAULT_LANG).build());
        userAttributes.add(AttributeType.builder()
                .name(CUSTOM_TENANT_ID).value(tenantName).build());
        userAttributes.add(AttributeType.builder()
                .name(CUSTOM_IS_ADMIN).value(Boolean.FALSE.toString()).build());
        userAttributes.add(AttributeType.builder()
                .name(CUSTOM_IS_MODIFY_EMPLOYEE).value(Boolean.FALSE.toString()).build());
        userAttributes.add(AttributeType.builder()
                .name(CUSTOM_IS_ACCESS_CONTRACT).value(Boolean.TRUE.toString()).build());

        AdminCreateUserRequest createUserCognitoRequest = AdminCreateUserRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .temporaryPassword(accountCognitoDTO.getPassword())
                .messageAction(MessageActionType.SUPPRESS)
                .userAttributes(userAttributes)
                .build();

        // create request to add user to group
        AdminAddUserToGroupRequest adminAddUserToGroupRequest = AdminAddUserToGroupRequest.builder()
                .userPoolId(userPoolId)
                .groupName(ESMS_GROUP)
                .username(email)
                .build();
        try {
            AdminCreateUserResponse createUserResponse = mIdentityProvider.adminCreateUser(createUserCognitoRequest);

            // add user to group
            mIdentityProvider.adminAddUserToGroup(adminAddUserToGroupRequest);

            CreateAccountCognitoResponseDTO data = new CreateAccountCognitoResponseDTO(
                    "Create cognito account success", createUserResponse.user().username());
            return new ContractSiteResponseDTO(SUCCESS.getValue(), data, null /* errors */);
        } catch (SdkClientException | AwsServiceException e) {
            log.error("Create cognito account failed");
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */,
                    List.of(new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getLocalizedMessage())));
        }
    }

    /**
     * @see CognitoAccountService#getAccountCognito(String)
     */
    @Override
    public ContractSiteResponseDTO getAccountCognito(String contractTenantId) {
        // 1. Validate request parameter
        if (StringUtils.isNullOrEmpty(contractTenantId)) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, CONTRACT_TENANT_ID_PARAM));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 2. Get cognito setting
        CognitoSettingInfoDTO cognitoSettingInfo = commonService
                .getCognitoSettingTenant(null /* tenantName */, contractTenantId)
                .orElse(null);
        if (cognitoSettingInfo == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, COGNITO_SETTING_PARAM));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        String userPoolId = cognitoSettingInfo.getUserPoolId();

        // 3. Get list of cognito user
        String paginationToken;
        List<CognitoAccountDTO> result = new ArrayList<>();

        do {
            ListUsersResponse listUsersResponse;
            try {
                listUsersResponse = getListCognitoUser(userPoolId);
            } catch (CustomException e) {
                ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(
                        Constants.INTERRUPT_API, e.getLocalizedMessage());
                return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
            }

            List<UserType> userList = listUsersResponse.users();
            List<CognitoAccountDTO> subCognitoAccountList = userList.stream()
                    .map(user -> {
                        List<AttributeType> attributeTypeList = user.attributes();

                        CognitoAccountDTO cognitoAccountDTO = new CognitoAccountDTO();
                        cognitoAccountDTO.setUserName(user.username());
                        cognitoAccountDTO.setEmployeeSurname(findCognitoAttribute(attributeTypeList, CUSTOM_EMPLOYEE_SURNAME));
                        cognitoAccountDTO.setEmployeeName(findCognitoAttribute(attributeTypeList, CUSTOM_EMPLOYEE_NAME));
                        cognitoAccountDTO.setEmail(findCognitoAttribute(attributeTypeList, EMAIL));
                        cognitoAccountDTO.setIsAccessContract(
                                Boolean.valueOf(findCognitoAttribute(attributeTypeList, CUSTOM_IS_ACCESS_CONTRACT)));
                        cognitoAccountDTO.setIsModifyEmployee(
                                Boolean.valueOf(findCognitoAttribute(attributeTypeList, CUSTOM_IS_MODIFY_EMPLOYEE)));

                        return cognitoAccountDTO;
                    }).collect(Collectors.toList());

            paginationToken = listUsersResponse.paginationToken();
            result.addAll(subCognitoAccountList);
        } while (paginationToken != null);

        return new ContractSiteResponseDTO(SUCCESS.getValue(), result, null /* errors */);
    }

    /**
     * @see CognitoAccountService#updateAccountCognito(String, String, UpdateAccountCognitoInfo)
     */
    @Override
    public ContractSiteResponseDTO updateAccountCognito(String contractTenantId, String userName,
            UpdateAccountCognitoInfo dataChange) {
        // 1. Validate request parameter
        List<ContractSiteErrorDataDTO> errors = validateUpdateAccountCognitoParams(contractTenantId, userName, dataChange);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        // 2. Get cognito setting
        CognitoSettingInfoDTO cognitoSettingInfo = commonService
                .getCognitoSettingTenant(null /* tenantName */, contractTenantId)
                .orElse(null);
        if (cognitoSettingInfo == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, COGNITO_SETTING_PARAM));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        String userPoolId = cognitoSettingInfo.getUserPoolId();

        // 3 Update Cognito user
        // 3.1 Get Cognito user to validate
        ContractSiteErrorDataDTO error = validateCognitoUser(userName, userPoolId);
        if (error != null) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        // 3.2 Update user
        List<AttributeType> userAttributes = new ArrayList<>();
        if (!StringUtils.isNullOrEmpty(dataChange.getEmail())) {
            userAttributes.add(AttributeType.builder()
                    .name(EMAIL).value(dataChange.getEmail()).build());
        }
        if (!StringUtils.isNullOrEmpty(dataChange.getEmployeeSurname())) {
            userAttributes.add(AttributeType.builder()
                    .name(CUSTOM_EMPLOYEE_SURNAME).value(dataChange.getEmployeeSurname()).build());
        }
        if (!StringUtils.isNullOrEmpty(dataChange.getEmployeeName())) {
            userAttributes.add(AttributeType.builder()
                    .name(CUSTOM_EMPLOYEE_NAME).value(dataChange.getEmployeeName()).build());
        }
        if (dataChange.getIsAccessContract() != null) {
            userAttributes.add(AttributeType.builder()
                .name(CUSTOM_IS_ACCESS_CONTRACT).value(dataChange.getIsAccessContract().toString()).build());
        }

        AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder()
                .username(userName)
                .userPoolId(userPoolId)
                .userAttributes(userAttributes)
                .build();

        try {
            // update attributes
            mIdentityProvider.adminUpdateUserAttributes(updateRequest);

            // update password
            if (!StringUtils.isNullOrEmpty(dataChange.getPassword())) {
                AdminSetUserPasswordRequest adminSetUserPasswordRequest = AdminSetUserPasswordRequest.builder()
                        .userPoolId(userPoolId)
                        .username(userName)
                        .password(dataChange.getPassword())
                        .build();

                mIdentityProvider.adminSetUserPassword(adminSetUserPasswordRequest);
            }

            UpdateAccountCognitoResponseDTO data = new UpdateAccountCognitoResponseDTO("Update cognito account success");
            return new ContractSiteResponseDTO(SUCCESS.getValue(), data, null /* errors */);
        } catch (SdkClientException | AwsServiceException e) {
            log.error("Update cognito account failed.");
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */,
                    List.of(new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getLocalizedMessage())));
        }
    }

    /**
     * @see CognitoAccountService#deleteAccountCognito(String, String)
     */
    @Override
    public ContractSiteResponseDTO deleteAccountCognito(String contractTenantId, String userName) {
        // 1. Validate request parameter
        List<ContractSiteErrorDataDTO> errors = validateDeleteAccountCognitoParams(contractTenantId, userName);
        if (!errors.isEmpty()) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, errors);
        }

        // 2. Get cognito setting
        CognitoSettingInfoDTO cognitoSettingInfo = commonService
                .getCognitoSettingTenant(null /* tenantName */, contractTenantId)
                .orElse(null);
        if (cognitoSettingInfo == null) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, COGNITO_SETTING_PARAM));
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        String userPoolId = cognitoSettingInfo.getUserPoolId();

        // 3 Delete Cognito user
        // 3.1 Get Cognito user to validate
        ContractSiteErrorDataDTO error = validateCognitoUser(userName, userPoolId);
        if (error != null) {
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error));
        }

        try {
            AdminDeleteUserRequest deleteRequest = AdminDeleteUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(userName)
                    .build();
            mIdentityProvider.adminDeleteUser(deleteRequest);

            DeleteAccountCognitoResponseDTO data = new DeleteAccountCognitoResponseDTO("Delete cognito account success");
            return new ContractSiteResponseDTO(SUCCESS.getValue(), data, null /* errors */);
        } catch (SdkClientException | AwsServiceException e) {
            log.error("Delete cognito account failed.");
            return new ContractSiteResponseDTO(ERROR.getValue(), null /* data */,
                    List.of(new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getLocalizedMessage())));
        }
    }

    /**
     * @see CognitoAccountService#deleteAccountCognitoByAccessContract(String, Boolean)
     */
    @Override
    public void deleteAccountCognitoByAccessContract(String userPoolId, Boolean isAccessContract) throws Exception {
        // Delete Cognito user
        String paginationToken;
        List<UserType> userList = new ArrayList<>();

        do {
            ListUsersResponse listUsersResponse = getListCognitoUser(userPoolId);
            userList.addAll(listUsersResponse.users());

            paginationToken = listUsersResponse.paginationToken();
        } while (paginationToken != null);

        for (UserType userType : userList) {
            boolean curAccessContract = Boolean.parseBoolean(
                    findCognitoAttribute(userType.attributes(), CUSTOM_IS_ACCESS_CONTRACT));

            if (isAccessContract.equals(curAccessContract)) {
                AdminDeleteUserRequest deleteRequest = AdminDeleteUserRequest.builder()
                        .userPoolId(userPoolId)
                        .username(userType.username())
                        .build();
                mIdentityProvider.adminDeleteUser(deleteRequest);
            }
        }

    }

    /**
     * Validate cognito user for update
     *
     * @param userName user name
     * @param userPoolId user pool id
     * @return {@link ContractSiteErrorDataDTO} if error
     */
    private ContractSiteErrorDataDTO validateCognitoUser(String userName, String userPoolId) {
        AdminGetUserRequest userRequest = AdminGetUserRequest.builder()
                .username(userName)
                .userPoolId(userPoolId)
                .build();
        try {
            AdminGetUserResponse user = mIdentityProvider.adminGetUser(userRequest);
            if (Boolean.parseBoolean(findCognitoAttribute(user.userAttributes(), CUSTOM_IS_MODIFY_EMPLOYEE))) {
                log.error("Update cognito account failed. This account cannot modify.");
                return new ContractSiteErrorDataDTO(ConstantsTenants.CANNOT_MODIFY_COGNITO_ACCOUNT,
                        getMessage(ConstantsTenants.CANNOT_MODIFY_COGNITO_ACCOUNT));
            }

        } catch (UserNotFoundException e) {
            log.error("Get cognito account to modify failed. Message = {}", e.getLocalizedMessage(), e);
            return new ContractSiteErrorDataDTO(Constants.ITEM_NOT_EXIST,
                    getMessage(Constants.ITEM_NOT_EXIST, USER_NAME_PARAM));
        } catch (SdkClientException | AwsServiceException e) {
            log.error("Update cognito account to modify failed. Message = {}", e.getLocalizedMessage(), e);
            return new ContractSiteErrorDataDTO(Constants.INTERRUPT_API,
                    getMessage(Constants.INTERRUPT_API));
        }

        return null;
    }

    /**
     * Get list of cognito user
     *
     * @param userPoolId user pool id
     * @return {@link ListUsersResponse}
     */
    private ListUsersResponse getListCognitoUser(String userPoolId) {
        ListUsersRequest usersRequest = ListUsersRequest.builder().userPoolId(userPoolId).build();
        try {
            return mIdentityProvider.listUsers(usersRequest);
        } catch (SdkClientException | AwsServiceException e) {
            log.error("Get cognito account failed.");
            throw new CustomException(e.getLocalizedMessage(), "get-account-cognito", Constants.INTERRUPT_API);
        }
    }

    /**
     * Get cognito attribute value with specified type
     *
     * @param attributes List of {@link AttributeType}
     * @param type attribute name
     * @return attribute value
     */
    private String findCognitoAttribute(List<AttributeType> attributes, String type) {
        return attributes.stream()
                .filter(attribute -> attribute.name().equals(type))
                .map(AttributeType::value)
                .findFirst()
                .orElse(null);
    }

    /**
     * Validate request for create account cognito
     *
     * @param accountCognitoDTO accountCognitoDTO
     * @return List of error
     */
    private List<ContractSiteErrorDataDTO> validateCreateAccountCognitoParams(
            CreateAccountCognitoRequestDTO accountCognitoDTO) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (StringUtils.isNullOrEmpty(accountCognitoDTO.getContractTenantId())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, CONTRACT_TENANT_ID_PARAM)));
        }

        if (StringUtils.isNullOrEmpty(accountCognitoDTO.getEmployeeSurname())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, "employeeSurname")));
        }

        if (StringUtils.isNullOrEmpty(accountCognitoDTO.getEmployeeName())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, "employeeName")));
        }

        if (StringUtils.isNullOrEmpty(accountCognitoDTO.getEmail())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, EMAIL)));
        }

        if (!EmailValidator.validate(accountCognitoDTO.getEmail())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.EMAIL_INVALID_CODE,
                    getMessage(Constants.EMAIL_INVALID_CODE)));
        }

        // validate password
        Optional.ofNullable(validatePasswordFormat(accountCognitoDTO.getPassword(), accountCognitoDTO.getEmail()))
            .ifPresent(errors::add);

        return errors;
    }

    /**
     * Validate request for update account cognito
     *
     * @param contractTenantId contractTenantId
     * @param userName userName
     * @param dataChange dataChange
     * @return List of error
     */
    private List<ContractSiteErrorDataDTO> validateUpdateAccountCognitoParams(String contractTenantId, String userName,
            UpdateAccountCognitoInfo dataChange) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (StringUtils.isNullOrEmpty(contractTenantId)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, CONTRACT_TENANT_ID_PARAM)));
        }
        if (StringUtils.isNullOrEmpty(userName)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, USER_NAME_PARAM)));
        }
        if (dataChange == null) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, "dataChange")));
        }

        if (dataChange != null &&
                !StringUtils.isNullOrEmpty(dataChange.getEmail()) && !EmailValidator.validate(dataChange.getEmail())) {
            errors.add(new ContractSiteErrorDataDTO(Constants.EMAIL_INVALID_CODE,
                    getMessage(Constants.EMAIL_INVALID_CODE)));
        }

        if (dataChange != null && !StringUtils.isNullOrEmpty(dataChange.getPassword())) {
            Optional.ofNullable(validatePasswordFormat(dataChange.getPassword(), userName))
                .ifPresent(errors::add);
        }

        return errors;
    }

    /**
     * Validate request for update account cognito
     *
     * @param contractTenantId contractTenantId
     * @param userName userName
     * @return List of error
     */
    private List<ContractSiteErrorDataDTO> validateDeleteAccountCognitoParams(String contractTenantId, String userName) {
        List<ContractSiteErrorDataDTO> errors = new ArrayList<>();

        if (StringUtils.isNullOrEmpty(contractTenantId)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, CONTRACT_TENANT_ID_PARAM)));
        }
        if (StringUtils.isNullOrEmpty(userName)) {
            errors.add(new ContractSiteErrorDataDTO(Constants.REQUIRED_PARAMETER,
                    getMessage(Constants.REQUIRED_PARAMETER, USER_NAME_PARAM)));
        }

        return errors;
    }
}
