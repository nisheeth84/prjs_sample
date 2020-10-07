package jp.co.softbrain.esales.tenants.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableMap;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.AwsLambdaProperties;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.config.oauth2.CognitoProperties;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.AuthenticationService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.tenants.service.dto.CognitoUserInfo;
import jp.co.softbrain.esales.tenants.service.dto.ErrorDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetUserInfoByTokenResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.RefreshTokenDTO;
import jp.co.softbrain.esales.tenants.service.dto.RefreshTokenResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UserInfoDTO;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminAddUserToGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeDataType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolClientRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolClientResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolDomainRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DeleteUserPoolClientRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DeleteUserPoolDomainRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DeleteUserPoolRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ExplicitAuthFlowsType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.GroupExistsException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InitiateAuthResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.LambdaConfigType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.MessageActionType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.NumberAttributeConstraintsType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.OAuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.PasswordPolicyType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.PreventUserExistenceErrorTypes;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ResourceNotFoundException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SchemaAttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserPoolMfaType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserPoolPolicyType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameAttributeType;

/**
 * Provide authentication and other user management services.
 */
@Service
public class AuthenticationServiceImpl extends AbstractTenantService implements AuthenticationService {

    private static final String USERNAME = "sub";
    private static final String OPENID = "openid";
    private static final String EMAIL_VERIFIED = "email_verified";
    private static final Integer TEMPORARY_PASSWORD_EXPIRE = 365;
    private static final Integer REFRESH_TOKEN_VALIDITY = 30;

    private final CognitoIdentityProviderClient mIdentityProvider;

    private final CognitoProperties cognitoProperties;

    private final AwsLambdaProperties awsLambdaProperties;

    private final TokenStore tokenStore;

    private final CommonService commonService;

    public AuthenticationServiceImpl(CognitoProperties cognitoProperties, AwsLambdaProperties awsLambdaProperties,
            TokenStore tokenStore, CommonService commonService) {
        this.cognitoProperties = cognitoProperties;
        this.awsLambdaProperties = awsLambdaProperties;
        this.tokenStore = tokenStore;
        this.commonService = commonService;
        mIdentityProvider = getAmazonCognitoIdentityClient();
    }

    /**
     * Build an DefaultCredentialsProvider object from the ID and secret key.
     *
     * @return an DefaultCredentialsProvider object, initialized with the ID and
     *         Key.
     */
    private DefaultCredentialsProvider getCredentials() {
        return DefaultCredentialsProvider.create();
    }

    /**
     * Build an AWS cognito identity provider, based on the parameters defined
     * in the CognitoResources interface.
     *
     * @return {@link CognitoIdentityProviderClient}
     */
    private CognitoIdentityProviderClient getAmazonCognitoIdentityClient() {
        return CognitoIdentityProviderClient.builder().credentialsProvider(getCredentials())
                .region(Region.AP_NORTHEAST_1).build();
    }

    /**
     * @see AuthenticationService#createUserPool(String)
     */
    @Override
    public String createUserPool(String poolName) {
        PasswordPolicyType passwordPolicy = PasswordPolicyType.builder()
            .minimumLength(8)
            .temporaryPasswordValidityDays(TEMPORARY_PASSWORD_EXPIRE)
            .build();

        UserPoolPolicyType policies = UserPoolPolicyType.builder().passwordPolicy(passwordPolicy).build();

        String preTokenGenArn = awsLambdaProperties.getPreTokenGenArn();
        CreateUserPoolRequest createUserPoolRequest = CreateUserPoolRequest.builder()
                .poolName("esale-" + poolName)
                .lambdaConfig(LambdaConfigType.builder().preTokenGeneration(preTokenGenArn).build())
                .usernameAttributes(UsernameAttributeType.EMAIL)
                .schema(getSchemaAttributeType())
                .policies(policies)
                .mfaConfiguration(UserPoolMfaType.OFF)
                .build();

        CreateUserPoolResponse userPool = mIdentityProvider.createUserPool(createUserPoolRequest);

        return (userPool.userPool() != null) ? userPool.userPool().id() : null;
    }

    /**
     * @see AuthenticationService#createUserPoolDomain(String, String)
     */
    @Override
    public void createUserPoolDomain(String userPoolId, String domainName) {
        mIdentityProvider.createUserPoolDomain(CreateUserPoolDomainRequest.builder()
            .domain(domainName).userPoolId(userPoolId).build());
    }

    /**
     * @see AuthenticationService#createUserGroup(String)
     */
    @Override
    public void createUserGroup(String userPoolId) {
        try {
            mIdentityProvider.createGroup(CreateGroupRequest.builder()
                .groupName(ESMS_GROUP).userPoolId(userPoolId).build());
        } catch (GroupExistsException e) {
            // if group already exist then skip and continue
        }
    }

    /**
     * @see AuthenticationService#addUserToGroup(String, String)
     */
    @Override
    public void addUserToGroup(String userPoolId, String username) {
        mIdentityProvider.adminAddUserToGroup(AdminAddUserToGroupRequest.builder()
            .groupName(ESMS_GROUP).username(username).userPoolId(userPoolId).build());
    }

    /**
     * @see AuthenticationService#createUserPoolClient(String, String, List)
     */
    @Override
    public String createUserPoolClient(String userPoolId, String tenantName, List<String> supportedIdentityProviders) {
        String callBackUrl = cognitoProperties.getCallBackUrl();
        String callBackClientUrl = String.format("%s/%s/", callBackUrl, tenantName);
        String callBackLogoutUrl = String.format("%s/account/logout", callBackClientUrl);

        CreateUserPoolClientRequest.Builder createUserPoolClientRequest = CreateUserPoolClientRequest.builder()
            .allowedOAuthFlows(getAllowedOAuthFlows())
            .allowedOAuthScopes(getAllowedOAuthScopes())
            .explicitAuthFlows(getExplicitAuthFlows())
            .explicitAuthFlowsWithStrings(getExplicitAuthFlowsString())
            .preventUserExistenceErrors(PreventUserExistenceErrorTypes.ENABLED)
            .callbackURLs(callBackClientUrl)
            .logoutURLs(callBackLogoutUrl)
            .clientName("esale-" + tenantName)
            .refreshTokenValidity(REFRESH_TOKEN_VALIDITY)
            .userPoolId(userPoolId);

        if (supportedIdentityProviders != null && !supportedIdentityProviders.isEmpty()) {
            createUserPoolClientRequest.supportedIdentityProviders(supportedIdentityProviders);
        }

        CreateUserPoolClientResponse userPoolClient = mIdentityProvider
            .createUserPoolClient(createUserPoolClientRequest.build());

        return (userPoolClient != null && userPoolClient.userPoolClient() != null)
            ? userPoolClient.userPoolClient().clientId()
            : null;
    }

    /**
     * @see AuthenticationService#createUser(String, CognitoUserInfo)
     */
    @Override
    public AdminCreateUserResponse createUser(String userPoolId, CognitoUserInfo userInfo) {
        String username = userInfo.getUsername();
        if (StringUtils.isBlank(username)) {
            return null;
        }

        List<AttributeType> userAttributes = new ArrayList<>();
        userAttributes.add(AttributeType.builder()
            .name(EMAIL).value(userInfo.getEmail())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(EMAIL_VERIFIED).value(Boolean.TRUE.toString())
            .build());
        if (StringUtils.isNotBlank(userInfo.getEmployeeSurname())) {
            userAttributes.add(AttributeType.builder()
                .name(CUSTOM_EMPLOYEE_SURNAME).value(userInfo.getEmployeeSurname())
                .build());
        }
        if (StringUtils.isNotBlank(userInfo.getEmployeeName())) {
            userAttributes.add(AttributeType.builder()
                .name(CUSTOM_EMPLOYEE_NAME).value(userInfo.getEmployeeName())
                .build());
        }

        if (userInfo.getEmployeeId() != null) {
            userAttributes.add(AttributeType.builder()
                .name(CUSTOM_EMPLOYEE_ID).value(userInfo.getEmployeeId().toString())
                .build());
        }
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_LANGUAGE_CODE).value(userInfo.getLanguageCode())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_TENANT_ID).value(userInfo.getTenantId().toString())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(UPDATED_AT).value(String.valueOf(userInfo.getUpdatedAt()))
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_IS_ADMIN).value(userInfo.getIsAdmin().toString())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_IS_MODIFY_EMPLOYEE).value(userInfo.getIsModifyEmployee().toString())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_IS_ACCESS_CONTRACT).value(userInfo.getIsModifyEmployee().toString())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_TIMEZONE_NAME).value(userInfo.getTimezoneName())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_FORMAT_DATE).value(userInfo.getFormatDate())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_RESET_CODE).value(userInfo.getResetCode())
            .build());
        userAttributes.add(AttributeType.builder()
            .name(CUSTOM_COMPANY_NAME).value(userInfo.getCompanyName())
            .build());

        AdminCreateUserRequest.Builder cognitoRequest = AdminCreateUserRequest.builder()
            .userPoolId(userPoolId)
            .username(username)
            .temporaryPassword(userInfo.getPassword())
            .messageAction(MessageActionType.SUPPRESS)
            .userAttributes(userAttributes);

        // The AdminCreateUserResult returned by this function doesn't
        // contain useful information so the result is ignored.
        return mIdentityProvider.adminCreateUser(cognitoRequest.build());
    }

    /**
     * @see AuthenticationService#deleteUserPool(String, String, String)
     */
    @Override
    public boolean deleteUserPool(String userPoolId, String clientId, String domainName) {
        deleteUserPoolDomain(userPoolId, domainName);

        if (StringUtils.isNotBlank(clientId)) {
            deleteUserPoolClient(userPoolId, clientId);
        }

        mIdentityProvider.deleteUserPool(DeleteUserPoolRequest.builder()
            .userPoolId(userPoolId).build());
        return true;
    }

    /**
     * @see AuthenticationService#deleteUserPoolDomain(String, String)
     */
    @Override
    public boolean deleteUserPoolDomain(String userPoolId, String domainName) {
        try {
            mIdentityProvider.deleteUserPoolDomain(DeleteUserPoolDomainRequest.builder()
                .userPoolId(userPoolId).domain(domainName).build());
            return true;
        } catch (ResourceNotFoundException e) {
            // do nothing
        }
        return false;
    }

    /**
     * @see AuthenticationService#deleteUserPoolClient(String, String)
     */
    @Override
    public boolean deleteUserPoolClient(String userPoolId, String clientId) {
        DeleteUserPoolClientRequest deleteUserPoolClientRequest = DeleteUserPoolClientRequest.builder()
            .clientId(clientId).userPoolId(userPoolId).build();
        mIdentityProvider.deleteUserPoolClient(deleteUserPoolClientRequest);
        return true;
    }

    /**
     * @see AuthenticationService#refreshToken(String, String)
     */
    @Override
    public RefreshTokenResponseDTO refreshToken(String contractTenantId, String refreshToken) {
        RefreshTokenResponseDTO responseDTO = new RefreshTokenResponseDTO();
        if (StringUtils.isBlank(contractTenantId) || StringUtils.isBlank(refreshToken)) {
            responseDTO.setStatus(ConstantsTenants.ResponseStatus.ERROR.getValue());
            responseDTO.setErrors(Collections.singletonList(createErrorDTO(Constants.REQUIRED_PARAMETER, "token")));
            return responseDTO;
        }

        try {
            // get cognito setting
            CognitoSettingInfoDTO cognitoSettingInfoDTO = commonService
                .getCognitoSettingTenant(null /* tenantName */, contractTenantId)
                .orElseThrow(() -> new CustomException(getMessage(Constants.ITEM_NOT_EXIST, COGNITO_SETTING_PARAM),
                    COGNITO_SETTING_PARAM, Constants.ITEM_NOT_EXIST));

            // refresh token
            InitiateAuthResponse initiateAuthResponse = mIdentityProvider.initiateAuth(
                InitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.REFRESH_TOKEN_AUTH)
                    .authParameters(ImmutableMap.of("REFRESH_TOKEN", refreshToken))
                    .clientId(cognitoSettingInfoDTO.getClientId())
                    .build());

            responseDTO.setStatus(ConstantsTenants.ResponseStatus.SUCCESS.getValue());
            responseDTO.setData(new RefreshTokenDTO(initiateAuthResponse.authenticationResult().idToken()));
            return responseDTO;
        } catch (Exception e) {
            responseDTO.setStatus(ConstantsTenants.ResponseStatus.ERROR.getValue());
            responseDTO.setErrors(Collections.singletonList(new ErrorDTO(Constants.INTERRUPT_API, e.getMessage())));
            return responseDTO;
        }
    }

    /**
     * @see AuthenticationService#getUserInfoByToken(String)
     */
    @Override
    public GetUserInfoByTokenResponseDTO getUserInfoByToken(String token) {
        GetUserInfoByTokenResponseDTO responseDTO = new GetUserInfoByTokenResponseDTO();
        if (StringUtils.isBlank(token)) {
            responseDTO.setStatus(ConstantsTenants.ResponseStatus.ERROR.getValue());
            responseDTO.setErrors(Collections.singletonList(createErrorDTO(Constants.REQUIRED_PARAMETER, "token")));
            return responseDTO;
        }

        try {
            OAuth2AccessToken accessToken = tokenStore.readAccessToken(token);
            Map<String, Object> additionalInformation = accessToken.getAdditionalInformation();

            UserInfoDTO userInfoDTO = new UserInfoDTO();
            userInfoDTO.setUsername(additionalInformation.get(USERNAME).toString());
            userInfoDTO.setEmployeeSurname(additionalInformation.get(CUSTOM_EMPLOYEE_SURNAME).toString());
            userInfoDTO.setEmployeeName(additionalInformation.get(CUSTOM_EMPLOYEE_NAME).toString());
            userInfoDTO.setEmail(additionalInformation.get(EMAIL).toString());
            Optional.ofNullable(additionalInformation.get(CUSTOM_IS_ACCESS_CONTRACT))
                .ifPresent(value -> userInfoDTO.setIsAccessContract(Boolean.valueOf(value.toString())));
            Optional.ofNullable(additionalInformation.get(CUSTOM_IS_MODIFY_EMPLOYEE))
                .ifPresent(value -> userInfoDTO.setIsModifyEmployee(Boolean.valueOf(value.toString())));
            userInfoDTO.setTenantName(additionalInformation.get(CUSTOM_TENANT_ID).toString());

            responseDTO.setStatus(ConstantsTenants.ResponseStatus.SUCCESS.getValue());
            responseDTO.setData(userInfoDTO);
            return responseDTO;
        } catch (Exception e) {
            responseDTO.setStatus(ConstantsTenants.ResponseStatus.ERROR.getValue());
            responseDTO.setErrors(Collections.singletonList(new ErrorDTO(Constants.INTERRUPT_API, e.getMessage())));
            return responseDTO;
        }
    }

    /**
     * Get schema attributes
     *
     * @return list {@link SchemaAttributeType}
     */
    private List<SchemaAttributeType> getSchemaAttributeType() {
        List<SchemaAttributeType> schemas = new ArrayList<>();
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(EMPLOYEE_SURNAME)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(EMPLOYEE_NAME)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.NUMBER)
                .name(EMPLOYEE_ID)
                .numberAttributeConstraints(NumberAttributeConstraintsType.builder().minValue("0").build())
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(LANGUAGE_CODE)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(TIMEZONE_NAME)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(TENANT_ID)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.BOOLEAN)
                .name(IS_ADMIN)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.BOOLEAN)
                .name(IS_MODIFY_EMPLOYEE)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.BOOLEAN)
                .name(IS_ACCESS_CONTRACT)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(FORMAT_DATE)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(RESET_CODE)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder()
                .attributeDataType(AttributeDataType.STRING)
                .name(COMPANY_NAME)
                .required(false).build());
        return schemas;
    }

    /**
     * Get Allowed OAuth Flows
     *
     * @return list {@link OAuthFlowType}
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
     * @return list allowed OAuth scopes
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
     * @return explicit auth flows
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
     * @return list {@link ExplicitAuthFlowsType}
     */
    private List<ExplicitAuthFlowsType> getExplicitAuthFlows() {
        List<ExplicitAuthFlowsType> explicitAuthFlows = new ArrayList<>();
        explicitAuthFlows.add(ExplicitAuthFlowsType.CUSTOM_AUTH_FLOW_ONLY);
        return explicitAuthFlows;
    }
}
