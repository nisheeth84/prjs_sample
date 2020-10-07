package jp.co.softbrain.esales.employees.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;

import javax.mail.MessagingException;

import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.LicenseService;
import jp.co.softbrain.esales.employees.service.dto.*;
import jp.co.softbrain.esales.employees.web.rest.vm.AuthCheckResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.CheckInvalidLicenseResponse;
import jp.co.softbrain.esales.utils.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.oauth2.common.util.RandomValueStringGenerator;
import org.springframework.stereotype.Service;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.config.oauth2.CognitoProperties;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.AuthenticationService;
import jp.co.softbrain.esales.employees.service.MailService;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetStatusContractRequest;
import jp.co.softbrain.esales.employees.service.dto.tenants.StatusContractDataDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.LoginInfoVM;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.http.HttpStatusCode;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminAddUserToGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminDeleteUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminRespondToAuthChallengeRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminSetUserPasswordRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminSetUserPasswordResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUserGlobalSignOutRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUserGlobalSignOutResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeDataType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthenticationResultType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ChallengeNameType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ChangePasswordRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateGroupRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateIdentityProviderRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolClientRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolClientResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DeleteUserPoolClientRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DeleteUserPoolRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ExplicitAuthFlowsType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InvalidParameterException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.LimitExceededException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ListUsersRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ListUsersResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.MessageActionType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.NotAuthorizedException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.NumberAttributeConstraintsType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.OAuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.PasswordPolicyType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SchemaAttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UpdateUserPoolClientRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserNotFoundException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserPoolMfaType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserPoolPolicyType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameAttributeType;

/**
 * Provide authentication and other user management services.
 */
/**
 * @author buithingocanh
 */
@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public static final int CREATION_STATUS_UNMADE_TENANT = 1; /* 未作成 */
    public static final int CREATION_STATUS_DOING_TENANT = 2; /* 作成中 */
    public static final int CREATION_STATUS_FINISHED_TENANT = 3; /* 作成完了 */

    public static final int CONTRACT_STATUS_START = 1; // 起動
    public static final int CONTRACT_STATUS_SUSPENDED = 2; // 停止
    public static final int CONTRACT_STATUS_DELETED = 3; // 削除

    private static final String USERNAME = "USERNAME";
    private static final String PASSWORD = "PASSWORD";
    private static final String NEW_PASSWORD = "NEW_PASSWORD";
    private static final String EMAIL = "email";
    private static final String OPENID = "openid";
    private static final String EMAIL_VERIFIED = "email_verified";
    private static final String EMPLOYEE_SURNAME = "employee_surname";
    private static final String CUSTOM_EMPLOYEE_SURNAME = "custom:employee_surname";
    private static final String EMPLOYEE_NAME = "employee_name";
    private static final String CUSTOM_EMPLOYEE_NAME = "custom:employee_name";
    private static final String UPDATED_AT = "updated_at";
    private static final String EMPLOYEE_ID = "employee_id";
    private static final String CUSTOM_EMPLOYEE_ID = "custom:employee_id";
    private static final String LANGUAGE_CODE = "language_code";
    private static final String CUSTOM_LANGUAGE_CODE = "custom:language_code";
    private static final String TENANT_ID = "tenant_id";
    private static final String CUSTOM_TENANT_ID = "custom:tenant_id";
    private static final String IS_ADMIN = "is_admin";
    private static final String CUSTOM_IS_ADMIN = "custom:is_admin";
    private static final String IS_ACCESS_CONTRACT = "is_access_contract";
    private static final String CUSTOM_IS_ACCESS_CONTRACT = "custom:is_access_contract";
    private static final String TIMEZONE_NAME = "timezone_name";
    private static final String CUSTOM_TIMEZONE_NAME = "custom:timezone_name";
    private static final String FORMAT_DATE = "format_date";
    private static final String CUSTOM_FORMAT_DATE = "custom:format_date";
    private static final String IS_MODIFY_EMPLOYEE = "is_modify_employee";
    private static final String CUSTOM_IS_MODIFY_EMPLOYEE = "custom:is_modify_employee";
    private static final String COMPANY_NAME = "company_name";
    private static final String CUSTOM_COMPANY_NAME = "custom:company_name";
    private static final String RESET_CODE = "reset_code";
    private static final String CUSTOM_RESET_CODE = "custom:reset_code";

    private static final Integer TEMPORARY_PASSWORD_EXPIRE = 365;
    private static final Integer PASSWORD_EXPIRE = 90;
    private static final Integer REFRESH_TOKEN_VALIDITY = 30;
    private static final String ESMS_GROUP = "ESMS";
    private static final String USERNAME_ITEM = "username";
    private static final String OLD_PASSWORD_ITEM = "oldPassword";
    private static final String NEW_PASSWORD_ITEM = "newPassword";
    private static final String ERR_LOG_0001 = "ERR_LOG_0001";
    private static final String ERR_LOG_0004 = "ERR_LOG_0004";
    private static final String ERR_COM_0038 = "ERR_COM_0038";
    private static final String ERR_LOG_0002 = "ERR_LOG_0002";
    private static final String ERR_LOG_0003 = "ERR_LOG_0003";
    private static final String ERR_LOG_0009 = "ERR_LOG_0009";
    private static final String ERR_LOG_0010 = "ERR_LOG_0010";
    private static final String ERR_LOG_0011 = "ERR_LOG_0011";
    private static final String ERR_LOG_0012 = "ERR_LOG_0012";
    private static final String ERR_LOG_0006 = "ERR_LOG_0006";

    private static final String SAML_SIGNIN_URL = "https://%s.auth.%s.amazoncognito.com/oauth2/authorize?redirect_uri=%s&response_type=token&client_id=%s&identity_provider=%s&scopes=email+openid";
    private static final String SAML_SIGNOUT_URL = "https://%s.auth.%s.amazoncognito.com/logout?redirect_uri=%s&client_id=%s&response_type=code&scopes=email+openid";
    private static final String URL_INPUT_TENANT = "account";

    private static final String VERIFY_PROPERTY_AUTHENTICATED = "authenticated";
    private static final String VERIFY_PROPERTY_CONTRACT_STATUS = "statusContract";
    private static final String VERIFY_PROPERTY_DAY_REMAIN_TRIAL = "dayRemainTrial";
    private static final String VERIFY_PROPERTY_IS_MISSING_LICENSE = "isMissingLicense";
    private static final String VERIFY_PROPERTY_AUTHORITIES = "authorities";
    private static final String VERIFY_PROPERTY_SIGNIN_URL = "signInUrl";
    private static final String VERIFY_PROPERTY_SIGNOUT_URL = "signOutUrl";
    private static final String VERIFY_PROPERTY_IS_ACCEPT = "isAccept";
    private static final String VERIFY_PROPERTY_SITE_CONTRACT = "siteContract";

    private static final String ESMS_SITE = "esms";

    // Regex for acceptable password
    public static final String PASSWORD_REGEX = "((?=.*[0-9a-zA-Z])(?=.*[@#$%!^&+=])(?=\\S+$).{8,32}|(?=.*[0-9@#$%!^&+=])(?=.*[a-zA-Z])(?=\\S+$).{8,32}|(?=.*[a-zA-Z@#$%!^&+=])(?=.*[0-9])(?=\\S+$).{8,32})";

    @Autowired
    private MailService mailService;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private LicenseService licenseService;

    @Autowired
    private EmployeesService employeesService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ApplicationProperties applicationProperties;

    private static CognitoIdentityProviderClient mIdentityProvider = null;

    private final CognitoProperties cognitoProperties;

    public AuthenticationServiceImpl(CognitoProperties cognitoProperties) {
        this.cognitoProperties = cognitoProperties;
        if (mIdentityProvider == null) {
            mIdentityProvider = getAmazonCognitoIdentityClient();
        }
    }

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

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * createUserPoolId()
     */
    public String createUserPoolId() {
        String tenantId = TenantContextHolder.getTenant();

        List<UsernameAttributeType> usernameAttributes = new ArrayList<>();
        usernameAttributes.add(UsernameAttributeType.EMAIL);

        PasswordPolicyType passwordPolicy = PasswordPolicyType.builder().minimumLength(8)
                .temporaryPasswordValidityDays(TEMPORARY_PASSWORD_EXPIRE).build();

        UserPoolPolicyType policies = UserPoolPolicyType.builder().passwordPolicy(passwordPolicy).build();

        CreateUserPoolRequest createUserPoolRequest = CreateUserPoolRequest.builder().poolName("esale-" + tenantId)
                .usernameAttributes(usernameAttributes).schema(getSchemaAttributeType()).policies(policies)
                .mfaConfiguration(UserPoolMfaType.OFF).build();
        CreateUserPoolResponse userPool = mIdentityProvider.createUserPool(createUserPoolRequest);

        if (userPool != null && userPool.userPool() != null) {
            createGroup(userPool.userPool().id());
            return userPool.userPool().id();
        }
        return null;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * createGroup(java.lang.String)
     */
    public boolean createGroup(String userPoolId) {
        if (StringUtils.isBlank(userPoolId)) {
            CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
            userPoolId = cognitoSetting.getUserPoolId();
        }
        CreateGroupRequest createGroupRequest = CreateGroupRequest.builder().groupName(ESMS_GROUP)
                .userPoolId(userPoolId).build();
        mIdentityProvider.createGroup(createGroupRequest);
        return true;
    }

    /**
     * get schema attributes
     *
     * @return
     */
    private List<SchemaAttributeType> getSchemaAttributeType() {
        List<SchemaAttributeType> schemas = new ArrayList<>();
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(EMPLOYEE_SURNAME)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(EMPLOYEE_NAME)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.NUMBER).name(EMPLOYEE_ID)
                .numberAttributeConstraints(NumberAttributeConstraintsType.builder().minValue("0").build())
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(LANGUAGE_CODE)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(TIMEZONE_NAME)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(FORMAT_DATE)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(TENANT_ID)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.BOOLEAN).name(IS_ADMIN)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.BOOLEAN).name(IS_ACCESS_CONTRACT)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.BOOLEAN).name(IS_MODIFY_EMPLOYEE)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(COMPANY_NAME)
                .required(false).build());
        schemas.add(SchemaAttributeType.builder().attributeDataType(AttributeDataType.STRING).name(RESET_CODE)
                .required(false).build());
        return schemas;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * deleteUserPool(java.lang.String, java.lang.String)
     */
    public boolean deleteUserPool(String userPoolId, String clientId) {
        if (StringUtils.isNotBlank(clientId)) {
            deleteUserPoolClient(userPoolId, clientId);
            DeleteUserPoolRequest deleteUserPoolRequest = DeleteUserPoolRequest.builder().userPoolId(userPoolId)
                    .build();
            mIdentityProvider.deleteUserPool(deleteUserPoolRequest);
            return true;
        }
        return false;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * deleteUserPoolClient(java.lang.String, java.lang.String)
     */
    public boolean deleteUserPoolClient(String userPoolId, String clientId) {
        DeleteUserPoolClientRequest deleteUserPoolClientRequest = DeleteUserPoolClientRequest.builder()
                .clientId(clientId).userPoolId(userPoolId).build();
        mIdentityProvider.deleteUserPoolClient(deleteUserPoolClientRequest);
        return true;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * createIdentityProvider(java.util.Map, java.lang.String, java.lang.String,
     * java.lang.String)
     */
    public boolean createIdentityProvider(Map<String, String> providerDetails, Map<String, String> attributeMapping,
            String providerName, String providerType, String userPoolId) {
        if (providerDetails != null && !providerDetails.isEmpty()) {
            CreateIdentityProviderRequest createIdentityProviderRequest = CreateIdentityProviderRequest.builder()
                    .providerName(providerName).providerType(providerType).providerDetails(providerDetails)
                    .attributeMapping(attributeMapping).userPoolId(userPoolId).build();
            mIdentityProvider.createIdentityProvider(createIdentityProviderRequest);
            return true;
        }
        return false;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * createUserPoolClient(java.lang.String, java.util.List)
     */
    public String createUserPoolClient(String userPoolId, List<String> supportedIdentityProviders) {

        String callBkacUrl = cognitoProperties.getCallBackUrl();

        String tenantId = TenantContextHolder.getTenant();
        String callBackClientUrl = String.format("%s/%s/", callBkacUrl, tenantId);
        String callBackLogoutUrl = String.format("%s/%s/account/logout", callBkacUrl, tenantId);

        CreateUserPoolClientRequest.Builder createUserPoolClientRequest = CreateUserPoolClientRequest.builder()
                .allowedOAuthFlows(getAllowedOAuthFlows()).allowedOAuthScopes(getAllowedOAuthScopes())
                .explicitAuthFlows(getExplicitAuthFlows()).explicitAuthFlowsWithStrings(getExplicitAuthFlowsString())
                .callbackURLs(callBackClientUrl).logoutURLs(callBackLogoutUrl).clientName("esale-" + tenantId)
                .refreshTokenValidity(REFRESH_TOKEN_VALIDITY).userPoolId(userPoolId);

        if (supportedIdentityProviders != null && !supportedIdentityProviders.isEmpty()) {
            createUserPoolClientRequest.supportedIdentityProviders(supportedIdentityProviders);
        }

        CreateUserPoolClientResponse userPoolClient = mIdentityProvider
                .createUserPoolClient(createUserPoolClientRequest.build());

        return (userPoolClient != null && userPoolClient.userPoolClient() != null)
                ? userPoolClient.userPoolClient().clientId()
                : null;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * updateIdentityProvider(java.util.List, java.lang.String,
     * java.lang.String)
     */
    public boolean updateIdentityProvider(List<String> supportedIdentityProviders, String clientId, String userPoolId) {
        if (supportedIdentityProviders != null && !supportedIdentityProviders.isEmpty()) {
            String callBkacUrl = cognitoProperties.getCallBackUrl();
            String tenantId = TenantContextHolder.getTenant();
            String callBackClientUrl = String.format("%s/%s/", callBkacUrl, tenantId);
            String callBackLogoutUrl = String.format("%s/%s/account/logout", callBkacUrl, tenantId);
            UpdateUserPoolClientRequest updateUserPoolClientRequest = UpdateUserPoolClientRequest.builder()
                    .allowedOAuthFlows(getAllowedOAuthFlows()).allowedOAuthScopes(getAllowedOAuthScopes())
                    .explicitAuthFlows(getExplicitAuthFlows())
                    .explicitAuthFlowsWithStrings(getExplicitAuthFlowsString())
                    .supportedIdentityProviders(supportedIdentityProviders).callbackURLs(callBackLogoutUrl)
                    .logoutURLs(callBackClientUrl).refreshTokenValidity(REFRESH_TOKEN_VALIDITY).clientId(clientId)
                    .userPoolId(userPoolId).build();
            mIdentityProvider.updateUserPoolClient(updateUserPoolClientRequest);
            return true;
        }
        return false;
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

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * createNewUser(jp.co.softbrain.esales.employees.service.dto.
     * CognitoUserInfo)
     */
    @Override
    public boolean createNewUser(final CognitoUserInfo userInfo) {
        final String username = userInfo.getUsername();
        if (username != null && username.length() > 0) {

            CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
            String userPoolId = cognitoSetting.getUserPoolId();

            // There should be no user with this email address, so info should
            // be null
            CognitoUserInfo info = findUserByUserName(username, userPoolId);
            if (!(info != null && info.getEmail().equals(userInfo.getEmail()))) {

                List<AttributeType> userAttributes = new ArrayList<>();
                userAttributes.add(AttributeType.builder().name(EMAIL).value(userInfo.getEmail()).build());
                userAttributes.add(AttributeType.builder().name(EMAIL_VERIFIED).value("true").build());

                AdminCreateUserRequest.Builder cognitoRequest = AdminCreateUserRequest.builder().userPoolId(userPoolId)
                        .username(username).userAttributes(userAttributes);

                if (StringUtils.isNotBlank(userInfo.getPassword())) {
                    cognitoRequest.temporaryPassword(userInfo.getPassword());
                    cognitoRequest.messageAction(MessageActionType.SUPPRESS);
                }

                try {
                    // The AdminCreateUserResult resturned by this function
                    // doesn't
                    // contain useful information so the
                    // result is ignored.
                    mIdentityProvider.adminCreateUser(cognitoRequest.build());

                    // add user to group
                    AdminAddUserToGroupRequest adminAddUserToGroupRequest = AdminAddUserToGroupRequest.builder()
                            .groupName(ESMS_GROUP).username(username).userPoolId(userPoolId).build();
                    mIdentityProvider.adminAddUserToGroup(adminAddUserToGroupRequest);

                    userInfo.setUpdatedAt(new Date());
                    updateUserAttributes(userInfo, cognitoSetting);
                } catch (Exception e) {
                    log.error(e.getLocalizedMessage());
                    try {
                        deleteUser(username, null, cognitoSetting, true);
                    } catch (Exception ex) {
                        // do not thing
                    }
                    throw new RuntimeException("Create Cognito user failed");
                }
            } else {

                if (userInfo.getIsSendMail() != null && userInfo.getIsSendMail()) {
                    // 7.7 set password
                    mIdentityProvider.adminSetUserPassword(AdminSetUserPasswordRequest.builder()
                        .userPoolId(userPoolId)
                        .username(username)
                        .permanent(true)
                        .password(userInfo.getPassword())
                        .build());

                    userInfo.setUpdatedAt(new Date());
                }

                // 7.4 update user Cognito
                updateUserAttributes(userInfo, cognitoSetting);
            }
            return true;
        }
        return false;
    } // createNewUser

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.service.AuthenticationService#deleteUser
     * (java.lang.String, java.lang.String, boolean)
     */
    @Override
    public boolean deleteUser(final String username, final String password, CognitoSettingInfoDTO cognitoSetting,
            boolean isAdmin) {

        if (cognitoSetting == null) {
            cognitoSetting = getCognitoSetting();
        }
        String userPoolId = cognitoSetting.getUserPoolId();
        CognitoUserInfo sessionInfo = null;
        if (!isAdmin) {
            String clientId = cognitoSetting.getClientId();

            sessionInfo = sessionLogin(username, password, clientId, userPoolId);
        }
        if (isAdmin || sessionInfo != null) {
            AdminDeleteUserRequest deleteRequest = AdminDeleteUserRequest.builder().username(username)
                    .userPoolId(userPoolId).build();

            // the adminDeleteUserRequest returns an AdminDeleteUserResult which
            // doesn't contain anything useful.
            // So the result is ignored.
            mIdentityProvider.adminDeleteUser(deleteRequest);
        }
        return true;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * updateUserAttributes(jp.co.softbrain.esales.employees.service.dto.
     * CognitoUserInfo,
     * jp.co.softbrain.esales.employees.service.dto.CognitoSettingsDTO)
     */
    @Override
    public boolean updateUserAttributes(final CognitoUserInfo newInfo, CognitoSettingInfoDTO cognitoSetting) {
        List<AttributeType> userAttributes = new ArrayList<>();
        if (newInfo.getEmployeeSurname() != null) {
            userAttributes.add(
                    AttributeType.builder().name(CUSTOM_EMPLOYEE_SURNAME).value(newInfo.getEmployeeSurname()).build());
        }
        if (newInfo.getEmployeeName() != null) {
            userAttributes
                    .add(AttributeType.builder().name(CUSTOM_EMPLOYEE_NAME).value(newInfo.getEmployeeName()).build());
        }
        if (newInfo.getUpdatedAt() != null) {
            userAttributes.add(AttributeType.builder().name(UPDATED_AT)
                    .value(String.valueOf(newInfo.getUpdatedAt().getTime())).build());
        }
        if (newInfo.getEmployeeId() != null) {
            userAttributes.add(
                    AttributeType.builder().name(CUSTOM_EMPLOYEE_ID).value(newInfo.getEmployeeId().toString()).build());
        }
        if (StringUtils.isNotBlank(newInfo.getLanguageCode())) {
            userAttributes
                    .add(AttributeType.builder().name(CUSTOM_LANGUAGE_CODE).value(newInfo.getLanguageCode()).build());
        }
        if (StringUtils.isNotBlank(newInfo.getTimezoneName())) {
            userAttributes
                    .add(AttributeType.builder().name(CUSTOM_TIMEZONE_NAME).value(newInfo.getTimezoneName()).build());
        }
        if (StringUtils.isNotBlank(newInfo.getFormatDate())) {
            userAttributes.add(AttributeType.builder().name(CUSTOM_FORMAT_DATE).value(newInfo.getFormatDate()).build());
        }
        if (StringUtils.isNotBlank(newInfo.getTenantId())) {
            userAttributes.add(AttributeType.builder().name(CUSTOM_TENANT_ID).value(newInfo.getTenantId()).build());
        }
        if (newInfo.getIsAdmin() != null) {
            userAttributes
                    .add(AttributeType.builder().name(CUSTOM_IS_ADMIN).value(newInfo.getIsAdmin().toString()).build());
        }
        if (newInfo.getIsAccessContract() != null) {
            userAttributes.add(AttributeType.builder().name(CUSTOM_IS_ACCESS_CONTRACT)
                    .value(newInfo.getIsAccessContract().toString()).build());
        }
        if (newInfo.getIsModifyEmployee() != null) {
            userAttributes.add(AttributeType.builder().name(CUSTOM_IS_MODIFY_EMPLOYEE)
                    .value(newInfo.getIsModifyEmployee().toString()).build());
        }
        if (newInfo.getCompanyName() != null) {
            userAttributes
                    .add(AttributeType.builder().name(CUSTOM_COMPANY_NAME).value(newInfo.getCompanyName()).build());
        }
        if (newInfo.getResetCode() != null) {
            userAttributes.add(AttributeType.builder().name(CUSTOM_RESET_CODE).value(newInfo.getResetCode()).build());
        }
        if (StringUtils.isNotBlank(newInfo.getEmail())) {
            userAttributes.add(AttributeType.builder().name(EMAIL).value(newInfo.getEmail()).build());
            userAttributes.add(AttributeType.builder().name(EMAIL_VERIFIED).value("true").build());
        }

        if (cognitoSetting == null || cognitoSetting.getUserPoolId() == null) {
            cognitoSetting = getCognitoSetting();
        }
        String userPoolId = cognitoSetting.getUserPoolId();

        AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder()
                .username(newInfo.getUsername()).userPoolId(userPoolId).userAttributes(userAttributes).build();
        mIdentityProvider.adminUpdateUserAttributes(updateRequest);
        return true;
    }

    /**
     * get Cognito Settings
     *
     * @return
     */
    public CognitoSettingInfoDTO getCognitoSetting() {
        CognitoSettingInfoDTO dto = restOperationUtils.executeCallPublicApi(
                Constants.PathEnum.TENANTS, "/public/api/get-cognito-setting", HttpMethod.POST, null,
                CognitoSettingInfoDTO.class, TenantContextHolder.getTenant());
        if (dto == null) {
            dto = new CognitoSettingInfoDTO();
        }
        return dto;
    }

    /**
     * After a successful authentication, Amazon Cognito returns user pool
     * tokens to your app.
     * The ID Token contains claims about the identity of the authenticated user
     * such as name, email, and phone_number.
     *
     * @param username
     * @param password
     * @return
     */
    private CognitoUserInfo sessionLogin(final String username, final String password, String clientId,
            String userPoolId) {

        CognitoUserInfo info = null;
        HashMap<String, String> authParams = new HashMap<>();
        authParams.put(USERNAME, username);
        authParams.put(PASSWORD, password);
        AdminInitiateAuthRequest authRequest = AdminInitiateAuthRequest.builder()
                .authFlow(AuthFlowType.ADMIN_NO_SRP_AUTH).userPoolId(userPoolId).clientId(clientId)
                .authParameters(authParams).build();

        AdminInitiateAuthResponse authResult = mIdentityProvider.adminInitiateAuth(authRequest);

        // If there is a bad username the adminInitiateAuth() call will throw a
        // UserNotFoundException.
        // Unfortunately the AWS documentation doesn't say what happens if the
        // password is incorrect.
        // Perhaps the NotAuthorizedException is thrown?
        if (authResult != null) {
            final String session = authResult.session();
            String accessToken = null;
            String idToken = null;
            String refreshToken = null;
            AuthenticationResultType resultType = authResult.authenticationResult();
            if (resultType != null) {
                accessToken = resultType.accessToken();
                idToken = resultType.idToken();
                refreshToken = resultType.refreshToken();
            }
            final String challengeResult = authResult.challengeNameAsString();
            info = new CognitoUserInfo();
            info.setSession(session);
            info.setAccessToken(accessToken);
            info.setIdToken(idToken);
            info.setRefreshToken(refreshToken);
            info.setChallengeResult(challengeResult);
        }
        return info;
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.service.AuthenticationService#userLogin(
     * java.lang.String, java.lang.String)
     */
    @Override
    public LoginInfoVM userLogin(final String username, final String password) {

        CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
        String clientId = cognitoSetting.getClientId();
        String userPoolId = cognitoSetting.getUserPoolId();

        LoginInfoVM loginInfo = null;
        try {
            CognitoUserInfo sessionInfo = sessionLogin(username, password, clientId, userPoolId);
            if (sessionInfo != null) {
                // The process of sessionLogin should either return a session ID
                // (if
                // the
                // account has not been verified) or a
                // token ID (if the account has been verified).
                CognitoUserInfo userInfo = getUserInfo(username, userPoolId);

                // clear reset code
                if (StringUtils.isNotBlank(userInfo.getResetCode())) {
                    // update password expire date
                    CognitoUserInfo newInfo = new CognitoUserInfo();
                    newInfo.setResetCode("");
                    newInfo.setUsername(username);
                    updateUserAttributes(newInfo, cognitoSetting);
                }

                loginInfo = new LoginInfoVM();
                loginInfo.setAccessToken(sessionInfo.getAccessToken());
                loginInfo.setIdToken(sessionInfo.getIdToken());
                loginInfo.setRefreshToken(sessionInfo.getRefreshToken());
                loginInfo.setUsername(userInfo.getUsername());
                loginInfo.setEmail(userInfo.getEmail());
                loginInfo.setEmployeeName(userInfo.getEmployeeName());
                if (userInfo.getEmployeeId() != null) {
                    loginInfo.setEmployeeId(userInfo.getEmployeeId());
                }
                if (userInfo.getRemainingDays() != null) {
                    loginInfo.setRemainingDays(userInfo.getRemainingDays());
                }
                loginInfo.setLanguageCode(userInfo.getLanguageCode());
                loginInfo.setTimezoneName(userInfo.getTimezoneName());
                loginInfo.setFormatDate(userInfo.getFormatDate());
                loginInfo.setTenantId(userInfo.getTenantId());
                loginInfo.setIsAdmin(userInfo.getIsAdmin());
                loginInfo.setIsAccessContract(userInfo.getIsAccessContract());

                // check to see if the password used was a temporary password.
                // If
                // this is the case, the password
                // must be reset.
                String challengeResult = sessionInfo.getChallengeResult();
                if (challengeResult != null && challengeResult.length() > 0) {
                    loginInfo.setNewPasswordRequired(
                            challengeResult.equals(ChallengeNameType.NEW_PASSWORD_REQUIRED.name()));
                }
            }
            else {
                loginFailed(null);
            }
        } catch (LimitExceededException ex) {
            log.warn(ex.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0011));
        } catch (CognitoIdentityProviderException e) {
            loginFailed(e);
        }
        return loginInfo;
    }

    /**
     * throw exception
     *
     * @param ex
     */
    private void loginFailed(Throwable ex) {
        if (ex != null) {
            log.warn(ex.getLocalizedMessage());
            if (ex.getMessage().contains("Password attempts exceeded")) {
                throw new CustomRestException(CommonUtils.putError("password", ERR_LOG_0011));
            }
        }
        throw new CustomRestException(CommonUtils.putError("password", ERR_LOG_0006));
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.service.AuthenticationService#userLogout
     * ()
     */
    @Override
    public boolean userLogout() {

        CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
        String userPoolId = cognitoSetting.getUserPoolId();

        try {
            Optional<String> loginId = SecurityUtils.getCurrentUserLogin();
            String username = loginId.isPresent() ? loginId.get() : null;
            AdminUserGlobalSignOutRequest signOutRequest = AdminUserGlobalSignOutRequest.builder().username(username)
                    .userPoolId(userPoolId).build();

            // The AdminUserGlobalSignOutResult returned by this function does
            // not
            // contain any useful information so the
            // result is ignored.
            AdminUserGlobalSignOutResponse result = mIdentityProvider.adminUserGlobalSignOut(signOutRequest);
            if (result.sdkHttpResponse().statusCode() == HttpStatusCode.OK) {
                log.debug("Logout success");
                return false;
            }
        } catch (LimitExceededException ex) {
            log.warn(ex.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0011));
        } catch (UserNotFoundException | InvalidParameterException ex) {
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0009));
        }
        return true;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * changePassword(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public boolean changePassword(String username, String oldPass, String newPass) {

        List<Map<String, Object>> errorsItems = new ArrayList<>();
        if (StringUtils.isBlank(oldPass)) {
            errorsItems.add(CommonUtils.putError(OLD_PASSWORD_ITEM, ERR_LOG_0001));
        }
        if (StringUtils.isBlank(newPass)) {
            errorsItems.add(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0001));
        }
        if (newPass.length() < 8 || newPass.length() > 32) {
            errorsItems.add(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_COM_0038));
        }
        if (!newPass.matches(PASSWORD_REGEX) || newPass.length() != newPass.getBytes().length) {
            // パスワードには、半角英字、半角数字、半角記号のうち2種類 以上を使用してください。
            errorsItems.add(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0012));
        }
        if (newPass.equals(username)) {
            errorsItems.add(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0004));
        }
        if (!errorsItems.isEmpty()) {
            throw new CustomRestException("change password failed", errorsItems);
        }

        CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
        String clientId = cognitoSetting.getClientId();
        String userPoolId = cognitoSetting.getUserPoolId();

        try {
            // Signin with the old/temporary password. Apparently this is needed
            // to
            // establish a session for the
            // password change.
            final CognitoUserInfo sessionInfo = sessionLogin(username, oldPass, clientId, userPoolId);
            if (sessionInfo != null && sessionInfo.getAccessToken() != null) {
                ChangePasswordRequest changeRequest = ChangePasswordRequest.builder()
                        .accessToken(sessionInfo.getAccessToken()).previousPassword(oldPass).proposedPassword(newPass)
                        .build();

                mIdentityProvider.changePassword(changeRequest);

                // update password expire date
                CognitoUserInfo newInfo = new CognitoUserInfo();
                newInfo.setUpdatedAt(new Date());
                newInfo.setResetCode("");
                newInfo.setUsername(username);
                updateUserAttributes(newInfo, cognitoSetting);
            }
            else {
                String msg = "Access token was not returned from session login";
                log.warn(msg);
                throw new CustomRestException(CommonUtils.putError(OLD_PASSWORD_ITEM, ERR_LOG_0009));
            }
        } catch (UserNotFoundException ex1) {
            log.warn(ex1.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0009));
        } catch (InvalidParameterException | NotAuthorizedException ex2) {
            log.warn(ex2.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(OLD_PASSWORD_ITEM, ERR_LOG_0009));
        } catch (LimitExceededException ex3) {
            log.warn(ex3.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0011));
        }
        return true;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * changeEmail(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public boolean changeEmail(final String username, final String newEmailAddr, final String userPoolId) {

        List<AttributeType> userAttributes = new ArrayList<>();
        userAttributes.add(AttributeType.builder().name(EMAIL).value(newEmailAddr).build());
        userAttributes.add(AttributeType.builder().name(EMAIL_VERIFIED).value("true").build());

        AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder().username(username)
                .userPoolId(userPoolId).userAttributes(userAttributes).build();
        mIdentityProvider.adminUpdateUserAttributes(updateRequest);
        return true;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * changeFromTemporaryPassword(java.lang.String, java.lang.String,
     * java.lang.String)
     */
    @Override
    public boolean changeFromTemporaryPassword(String username, String oldPass, String newPass) {

        if (StringUtils.isBlank(newPass)) {
            throw new CustomRestException(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0001));
        }
        else if (newPass.length() < 8 || newPass.length() > 32) {
            throw new CustomRestException(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_COM_0038));
        }
        else if (!newPass.matches(PASSWORD_REGEX)) {
            // パスワードには、半角英字、半角数字、半角記号のうち2種類 以上を使用してください。
            throw new CustomRestException(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0012));
        }
        else if (newPass.equals(username)) {
            throw new CustomRestException(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0004));
        }

        CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
        String clientId = cognitoSetting.getClientId();
        String userPoolId = cognitoSetting.getUserPoolId();

        // Signin with the old/temporary password. Apparently this is needed to
        // establish a session for the
        // password change.
        try {
            final CognitoUserInfo sessionInfo = sessionLogin(username, oldPass, clientId, userPoolId);
            if (sessionInfo == null) {
                return false;
            }
            final String sessionString = sessionInfo.getSession();
            if (sessionString != null && sessionString.length() > 0) {
                Map<String, String> challengeResponses = new HashMap<>();
                challengeResponses.put(USERNAME, username);
                challengeResponses.put(PASSWORD, oldPass);
                challengeResponses.put(NEW_PASSWORD, newPass);

                AdminRespondToAuthChallengeRequest changeRequest = AdminRespondToAuthChallengeRequest.builder()
                        .challengeName(ChallengeNameType.NEW_PASSWORD_REQUIRED).challengeResponses(challengeResponses)
                        .clientId(clientId).userPoolId(userPoolId).session(sessionString).build();

                mIdentityProvider.adminRespondToAuthChallenge(changeRequest);

                // update password expire date
                CognitoUserInfo newInfo = new CognitoUserInfo();
                newInfo.setUpdatedAt(new Date());
                newInfo.setResetCode("");
                newInfo.setUsername(username);
                updateUserAttributes(newInfo, cognitoSetting);
            }
        } catch (UserNotFoundException | InvalidParameterException | NotAuthorizedException ex1) {
            log.warn(ex1.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0009));
        } catch (LimitExceededException ex2) {
            log.warn(ex2.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0011));
        }
        return true;
    } // changePassword

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * adminChangePassword(java.lang.String, java.lang.String)
     */
    public boolean adminChangePassword(String username, String newPass) {
        CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
        String userPoolId = cognitoSetting.getUserPoolId();
        try {
            CognitoUserInfo userInfo = getUserInfo(username, userPoolId);
            if (userInfo != null) {

                AdminSetUserPasswordRequest adminSetUserPasswordRequest = AdminSetUserPasswordRequest.builder()
                        .password(newPass).permanent(true).userPoolId(userPoolId).username(username).build();
                AdminSetUserPasswordResponse result = mIdentityProvider
                        .adminSetUserPassword(adminSetUserPasswordRequest);

                if (result.sdkHttpResponse().statusCode() == HttpStatusCode.OK) {
                    // reset resetCode
                    CognitoUserInfo newInfo = new CognitoUserInfo();
                    newInfo.setUpdatedAt(new Date());
                    newInfo.setResetCode("");
                    newInfo.setUsername(username);
                    updateUserAttributes(newInfo, cognitoSetting);
                    return true;
                }
                else {
                    return false;
                }
            }
        } catch (LimitExceededException ex) {
            log.warn(ex.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0011));
        } catch (UserNotFoundException | InvalidParameterException ex) {
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0003));
        }
        return false;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * resetPassword(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public boolean resetPassword(String username, String resetCode, String newPass) {
        if (!CheckUtil.isMailAddress(username)) {
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0002));
        }
        if (newPass.length() < 8 || newPass.length() > 32) {
            throw new CustomRestException(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_COM_0038));
        }
        else if (!newPass.matches(PASSWORD_REGEX)) {
            // パスワードには、半角英字、半角数字、半角記号のうち2種類 以上を使用してください。
            throw new CustomRestException(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0012));
        }
        else if (newPass.equals(username)) {
            throw new CustomRestException(CommonUtils.putError(NEW_PASSWORD_ITEM, ERR_LOG_0004));
        }

        CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
        String userPoolId = cognitoSetting.getUserPoolId();

        try {
            CognitoUserInfo userInfo = getUserInfo(username, userPoolId);
            if (userInfo != null) {
                long diff = 0;
                if (StringUtils.isBlank(resetCode) || !resetCode.equals(userInfo.getResetCode())) {
                    throw new CustomRestException(CommonUtils.putError("resetCode", ERR_LOG_0010));
                }
                else if (StringUtils.isNotBlank(userInfo.getResetCode())) {
                    // check expire 1h
                    long plus = 60 * 60 * 1000L;
                    long miliSeconds = userInfo.getUpdatedAt().getTime();
                    diff = TimeUnit.SECONDS.convert(miliSeconds + plus - Instant.now().toEpochMilli(),
                            TimeUnit.MILLISECONDS);
                }
                if (diff <= 0) {
                    return false;
                }

                AdminSetUserPasswordRequest adminSetUserPasswordRequest = AdminSetUserPasswordRequest.builder()
                        .password(newPass).permanent(true).userPoolId(userPoolId).username(username).build();
                AdminSetUserPasswordResponse result = mIdentityProvider
                        .adminSetUserPassword(adminSetUserPasswordRequest);

                if (result.sdkHttpResponse().statusCode() == HttpStatusCode.OK) {

                    // reset resetCode
                    CognitoUserInfo newInfo = new CognitoUserInfo();
                    newInfo.setUpdatedAt(new Date());
                    newInfo.setResetCode("");
                    newInfo.setUsername(username);
                    updateUserAttributes(newInfo, cognitoSetting);
                    return true;
                }
                else {
                    return false;
                }
            }
        } catch (LimitExceededException ex) {
            log.warn(ex.getLocalizedMessage());
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0011));
        } catch (UserNotFoundException | InvalidParameterException ex) {
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0003));
        }
        return false;
    }

    /**
     * get password
     * Cognito password policies min lenght: 8
     *
     * @return
     */
    private static String getPassword() {
        RandomValueStringGenerator randomValueStringGenerator = new RandomValueStringGenerator(8);
        String pass = randomValueStringGenerator.generate().toLowerCase();
        if (!pass.matches("^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$")) {
            pass = getPassword();
        }
        return pass;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.AuthenticationService#
     * forgotPassword(java.lang.String)
     */
    @Override
    public boolean forgotPassword(final String username) {
        CognitoSettingInfoDTO cognitoSetting = getCognitoSetting();
        // validate email
        if (!CheckUtil.isMailAddress(username)) {
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0002));
        }
        String userPoolId = cognitoSetting.getUserPoolId();

        CognitoUserInfo userInfo;
        try {
            userInfo = getUserInfo(username, userPoolId);
            if (userInfo == null || username != null && !username.equals(userInfo.getEmail())) {
                throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0003));
            }
        } catch (UserNotFoundException ex) {
            throw new CustomRestException(CommonUtils.putError(USERNAME_ITEM, ERR_LOG_0003));
        }
        String resetCode = getPassword();
        CognitoUserInfo newInfo = new CognitoUserInfo();
        newInfo.setUpdatedAt(new Date());
        newInfo.setResetCode(resetCode);
        newInfo.setUsername(username);
        updateUserAttributes(newInfo, cognitoSetting);

        ForgotPasswordInputDTO forgotInput = new ForgotPasswordInputDTO();
        forgotInput.setEmail(userInfo.getEmail());
        forgotInput.setUsername(userInfo.getEmployeeSurname());
        forgotInput.setResetCode(resetCode);

        String callBkacUrl = cognitoProperties.getCallBackUrl();
        String tenantId = TenantContextHolder.getTenant();
        String callBackClientUrl = String.format("%s/%s/account/reset/code?resetCode=%s", callBkacUrl, tenantId,
                resetCode);

        forgotInput.setUrl(callBackClientUrl);
        String languageCode = userInfo.getLanguageCode();
        if (StringUtils.isBlank(languageCode)) {
            languageCode = "ja_jp";
        }
        try {
            mailService.sendMailForgotPassword(forgotInput, languageCode);
        } catch (MessagingException e) {
            log.warn(e.getLocalizedMessage());
        }
        return true;
    }

    /**
     * Get the information associated with the user.
     *
     * @param username the name of the user to be returned
     * @return a UserCognito object if the information could be retreived, null
     *         otherwise.
     */
    private CognitoUserInfo getUserInfo(String username, String userPoolId) {
        AdminGetUserRequest userRequest = AdminGetUserRequest.builder().username(username).userPoolId(userPoolId)
                .build();

        AdminGetUserResponse userResult = mIdentityProvider.adminGetUser(userRequest);
        List<AttributeType> userAttributes = userResult.userAttributes();
        final String rsltUserName = userResult.username();

        CognitoUserInfo info = new CognitoUserInfo();
        String emailAddr = null;
        for (AttributeType attr : userAttributes) {
            if (attr.name().equals(EMAIL)) {
                emailAddr = attr.value();
            }
            else if (attr.name().equals(CUSTOM_EMPLOYEE_SURNAME) || attr.name().equals(EMPLOYEE_SURNAME)) {
                info.setEmployeeSurname(attr.value());
            }
            else if (attr.name().equals(CUSTOM_EMPLOYEE_NAME) || attr.name().equals(EMPLOYEE_NAME)) {
                info.setEmployeeName(attr.value());
            }
            else if (attr.name().equals(UPDATED_AT)) {
                Integer remainingDays = 0;
                if (attr.value() != null) {
                    long plus = (PASSWORD_EXPIRE + 1) * 24 * 60 * 60 * 1000L;
                    long miliSeconds = Long.parseLong(attr.value());
                    info.setUpdatedAt(new Date(miliSeconds));
                    Long diff = TimeUnit.DAYS.convert(miliSeconds + plus - Instant.now().toEpochMilli(),
                            TimeUnit.MILLISECONDS);
                    remainingDays = diff.intValue();
                }

                info.setRemainingDays(remainingDays);
            }
            else if (attr.name().equals(CUSTOM_EMPLOYEE_ID) || attr.name().equals(EMPLOYEE_ID)) {
                info.setEmployeeId(Long.valueOf(attr.value()));
            }
            else if (attr.name().equals(CUSTOM_LANGUAGE_CODE) || attr.name().equals(LANGUAGE_CODE)) {
                info.setLanguageCode(attr.value());
            }
            else if (attr.name().equals(CUSTOM_TENANT_ID) || attr.name().equals(TENANT_ID)) {
                info.setTenantId(attr.value());
            }
            else if (attr.name().equals(CUSTOM_TIMEZONE_NAME) || attr.name().equals(TIMEZONE_NAME)) {
                info.setTimezoneName(attr.value());
            }
            else if (attr.name().equals(CUSTOM_FORMAT_DATE) || attr.name().equals(FORMAT_DATE)) {
                info.setFormatDate(attr.value());
            }
            else if (attr.name().equals(CUSTOM_IS_ADMIN) || attr.name().equals(IS_ADMIN)) {
                info.setIsAdmin(Boolean.valueOf(attr.value()));
            }
            else if (attr.name().equals(CUSTOM_IS_ACCESS_CONTRACT) || attr.name().equals(IS_ACCESS_CONTRACT)) {
                info.setIsAccessContract(Boolean.valueOf(attr.value()));
            }
            else if (attr.name().equals(CUSTOM_IS_MODIFY_EMPLOYEE) || attr.name().equals(IS_MODIFY_EMPLOYEE)) {
                info.setIsModifyEmployee(Boolean.valueOf(attr.value()));
            }
            else if (attr.name().equals(CUSTOM_COMPANY_NAME) || attr.name().equals(COMPANY_NAME)) {
                info.setCompanyName(attr.value());
            }
            else if (attr.name().equals(CUSTOM_RESET_CODE) || attr.name().equals(RESET_CODE)) {
                info.setResetCode(attr.value());
            }
        }

        if (rsltUserName != null && emailAddr != null) {
            info.setUsername(rsltUserName);
            info.setEmail(emailAddr);
        }
        else {
            info = null;
        }
        return info;
    } // getUserInfo

    /**
     * Find a user by their email address.
     *
     * @return a UserCognito object if the lookup succeeded or null if there was
     *         no
     *         user associated with that email
     *         address.
     */
    @Override
    public CognitoUserInfo findUserByUserName(String username, String userPoolId) {
        CognitoUserInfo info = null;
        if (username != null && username.length() > 0) {
            final String emailQuery = "email=\"" + username + "\"";
            ListUsersRequest usersRequest = ListUsersRequest.builder().userPoolId(userPoolId)
                    .attributesToGet(EMAIL, CUSTOM_IS_ACCESS_CONTRACT)
                    .filter(emailQuery).build();

            ListUsersResponse usersRslt = mIdentityProvider.listUsers(usersRequest);
            List<UserType> users = usersRslt.users();
            if (users != null && !users.isEmpty()) {

                // There should only be a single instance of an email address in
                // the Cognito database
                // (e.g., there should not be multiple users with the same email
                // address).
                if (users.size() == 1) {
                    UserType user = users.get(0);
                    final String userId = user.username();
                    String emailAddr = null;
                    String isAccessContractSide = "false";
                    List<AttributeType> attributes = user.attributes();
                    if (attributes != null) {
                        for (AttributeType attr : attributes) {
                            if (attr.name().equals(EMAIL)) {
                                emailAddr = attr.value();
                            }
                            if (attr.name().equals(CUSTOM_IS_ACCESS_CONTRACT)) {
                                isAccessContractSide = attr.value();
                            }
                        }
                        if (userId != null && emailAddr != null) {
                            info = new CognitoUserInfo();
                            info.setUsername(userId);
                            info.setEmail(emailAddr);
                            info.setIsAccessContract(StringUtils.isBlank(isAccessContractSide)
                                    || ConstantsEmployees.NULL_STRING.equalsIgnoreCase(isAccessContractSide) ? false
                                            : Boolean.valueOf(isAccessContractSide));
                        }
                    }
                } else {
                    throw new RuntimeException("More than one user has the username " + username);
                }
            }
        }
        return info;
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.service.AuthenticationService#hasUser(
     * java.lang.String, java.lang.String)
     */
    @Override
    public boolean hasUser(final String username, final String userPoolId) {
        boolean userExists = false;
        CognitoUserInfo info = getUserInfo(username, userPoolId);
        if (info != null && info.getUsername() != null && info.getUsername().length() > 0
                && info.getUsername().equals(username)) {
            userExists = true;
        }
        return userExists;
    }

    @Override
    public GetStatusContractOutDTO getStatusContract() {
        GetStatusContractOutDTO response = new GetStatusContractOutDTO();
        String token = SecurityUtils.getTokenValue().orElse(null);
        // 2. Call API getStatusContract
        StatusContractDataDTO statusContract = null;
        try {
            statusContract = restOperationUtils.executeCallApi(Constants.PathEnum.TENANTS, "get-status-contract",
                    HttpMethod.POST, new GetStatusContractRequest(jwtTokenUtil.getTenantIdFromToken()),
                    StatusContractDataDTO.class, token, jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            return response;
        }
        // 3. Check the API return value
        if (statusContract.getContractStatus() == 1 && statusContract.getTrialEndDate() != null) {
            // 4. Check the status of the contract
            int dayRemainTrial = (int) ((statusContract.getTrialEndDate().getTime() - Instant.now().toEpochMilli())
                    / (1000 * 60 * 60 * 24));
            if (dayRemainTrial < 0) {
                response.setMessageNotification(ConstantsEmployees.WAR_LOG_0003);
            }
            else {
                response.setMessageNotification(ConstantsEmployees.WAR_LOG_0002);
            }
            response.setDayRemainTrial(dayRemainTrial);
        }
        else if (statusContract.getContractStatus() != 1) {
            response.setMessageNotification(ConstantsEmployees.WAR_LOG_0004);
        }
        response.setStatusContract(statusContract.getContractStatus());
        return response;
    }

    /**
     * Verifying the user's contract status, authentication info
     *
     * @param site of the request client
     * @param userAgent of the request client
     * @param ipAddress client's remote ip
     * @return a map contains information about:
     * authenticated, statusContract, trialEndDate, signInUrl (SAML), signOutUrl (SAML), isAccept (IP address)
     */
    @Override
    public Map<String, Object> verify(String site, String userAgent, String ipAddress) {
        if (StringUtils.isBlank(TenantContextHolder.getTenant()) || URL_INPUT_TENANT.equals(TenantContextHolder.getTenant())) {
            return Collections.emptyMap();
        }

        // 11 Check valid IP
        boolean isAccept = true;
//        if (ESMS_SITE.equalsIgnoreCase(site)) {
//            CheckAccessIpAddressesRequest requestDto = new CheckAccessIpAddressesRequest(ipAddress);
//            CheckAccessIpAddressesOutDTO ipAddressesDto = restOperationUtils.executeCallPublicApi(
//                Constants.PathEnum.TENANTS, "/public/api/check-access-ip-addresses", HttpMethod.POST, requestDto,
//                CheckAccessIpAddressesOutDTO.class, Constants.TENANTS_SERVICE);
//            isAccept = ipAddressesDto.getIsAccept() != null && ipAddressesDto.getIsAccept();
//        }

        // 3
        if (SecurityUtils.isAuthenticated()) {
            // 4 call API getStatusContract
            StatusContractDataDTO statusContract = restOperationUtils.executeCallApi(Constants.PathEnum.TENANTS, "get-status-contract",
                HttpMethod.POST, new GetStatusContractRequest(jwtTokenUtil.getTenantIdFromToken()),
                StatusContractDataDTO.class, SecurityUtils.getTokenValue().orElse(""), jwtTokenUtil.getTenantIdFromToken());
            
            if (statusContract == null) {
                throw new CustomRestException("Empty StatusContract", Collections.emptyMap());
            }

            Map<String, Object> result = new HashMap<>();
            AuthCheckResponse authCheck;
            if (statusContract.getContractStatus() == CONTRACT_STATUS_START
                    && statusContract.getCreationStatus() == CREATION_STATUS_FINISHED_TENANT) {
                // 5 call api checkInvalidLicense
                CheckInvalidLicenseResponse checkLicenseResponse = licenseService.checkInvalidLicense(null);

                // 6 call api checkInvalidLicense
                if (Boolean.TRUE.equals(checkLicenseResponse.getIsInvalidLicense())) {
                    // 7
                    if (SecurityUtils.isAdmin()) {
                        authCheck = getAuthCheckResponse(statusContract.getContractStatus());
                        int employeeServiceId = 8;
                        authCheck.setLicenses(Collections.singleton(employeeServiceId));
                    } else {
                        // 10
                        userLogout();
                        result.put(VERIFY_PROPERTY_AUTHENTICATED, null);
                        result.put(VERIFY_PROPERTY_IS_MISSING_LICENSE, true);
                        result.put(VERIFY_PROPERTY_IS_ACCEPT, isAccept);
                        return Collections.unmodifiableMap(result);
                    }

                } else {
                    authCheck = getAuthCheckResponse(statusContract.getContractStatus());
                }

            } else {
                authCheck = getAuthCheckResponse(statusContract.getContractStatus());
            }

            if (statusContract.getContractStatus() == CONTRACT_STATUS_START
                    && statusContract.getTrialEndDate() != null) {
                // 4. Check the status of the contract
                int dayRemainTrial = (int) (statusContract.getTrialEndDate().getTime() / (1000 * 60 * 60 * 24)
                        - Instant.now().toEpochMilli() / (1000 * 60 * 60 * 24));
                result.put(VERIFY_PROPERTY_DAY_REMAIN_TRIAL, dayRemainTrial);
            }
            result.put(VERIFY_PROPERTY_AUTHENTICATED, authCheck);
            result.put(VERIFY_PROPERTY_CONTRACT_STATUS, statusContract.getContractStatus());
            result.put(VERIFY_PROPERTY_IS_ACCEPT, isAccept);
            result.put(VERIFY_PROPERTY_SITE_CONTRACT, applicationProperties.getSiteContract());
            return Collections.unmodifiableMap(result);

        } else {
            // 12 Check SAML
            boolean isMobile = isMobile(userAgent);

            // 2 call API getCognitoSetting
            CognitoSettingInfoDTO cognitoSettingsDTO = null;
            try {
                cognitoSettingsDTO = getCognitoSetting();
            } catch (Exception err){
                log.debug("Error while getCognitoSetting", err);
            }

            Map<String, Object> result = new HashMap<>();
            if (cognitoSettingsDTO != null && ((isMobile && Boolean.TRUE.equals(cognitoSettingsDTO.getIsApp()))
                    || (!isMobile && Boolean.TRUE.equals(cognitoSettingsDTO.getIsPc())))) {
                String callbackUrl = URLEncoder.encode(
                    cognitoProperties.getCallBackUrl() + "/" + TenantContextHolder.getTenant() + "/",
                    StandardCharsets.UTF_8);

                String samlSignInUrl = String.format(SAML_SIGNIN_URL, TenantContextHolder.getTenant(),
                    cognitoProperties.getSignatureVerification().getRegion(),
                    callbackUrl, cognitoSettingsDTO.getClientId(),
                    URLEncoder.encode(cognitoSettingsDTO.getProviderName(), StandardCharsets.UTF_8));

                String samlSignOutUrl = String.format(SAML_SIGNOUT_URL, TenantContextHolder.getTenant(),
                    cognitoProperties.getSignatureVerification().getRegion(),
                    callbackUrl, cognitoSettingsDTO.getClientId());

                result.put(VERIFY_PROPERTY_AUTHORITIES, null);
                result.put(VERIFY_PROPERTY_SIGNIN_URL, samlSignInUrl);
                result.put(VERIFY_PROPERTY_SIGNOUT_URL, samlSignOutUrl);
            }
            else {
                result.put(VERIFY_PROPERTY_AUTHENTICATED, null);
            }
            result.put(VERIFY_PROPERTY_IS_ACCEPT, isAccept);
            return Collections.unmodifiableMap(result);
        }
    }

    // 8
    private AuthCheckResponse getAuthCheckResponse(Integer statusContract) {
        AuthCheckResponse authCheck = new AuthCheckResponse();
        Set<String> authorities = new HashSet<>();

        if (SecurityUtils.isAdmin()) {
            authorities.add(Constants.Roles.ROLE_ADMIN);
        }
        authorities.add(Constants.Roles.ROLE_USER);

        authCheck.setAuthorities(authorities);
        authCheck.setLanguageCode(jwtTokenUtil.getLanguageCodeFromToken());
        authCheck.setIsAccessContract(jwtTokenUtil.getIsAccessContract());
        authCheck.setLicenses(jwtTokenUtil.getLicenses());

        String formatDate = jwtTokenUtil.getFormatDateFromToken();
        formatDate = StringUtils.isNotBlank(formatDate)
            ? formatDate.replace("yyyy", "YYYY").replace("dd", "DD")
            : ConstantsEmployees.APP_DATE_FORMAT_ES.replace("yyyy", "YYYY").replace("dd", "DD");

        authCheck.setFormatDate(formatDate);
        authCheck.setTimezoneName(jwtTokenUtil.getTimeZoneFromToken());

        // get employee icon path
        EmployeesDTO employee = null;
        if (jwtTokenUtil.getEmployeeIdFromToken() != null && statusContract != CONTRACT_STATUS_DELETED) {
            employee = employeesService.findOne(jwtTokenUtil.getEmployeeIdFromToken()).orElse(null);
        }

        String photoUrl = (employee != null && StringUtils.isNotBlank(employee.getPhotoFilePath()))
            ? S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(), employee.getPhotoFilePath(),
                applicationProperties.getExpiredSeconds())
            : "";

        authCheck.setIsEmployeeExisted(employee != null);
        authCheck.setIconPath(photoUrl);
        return authCheck;
    }

    /**
     * @param userAgent of the client request
     * @return true if the request is from mobile, otherwise false
     */
    private boolean isMobile(String userAgent) {
        return (userAgent != null && (userAgent.contains("ios") || userAgent.contains("android")));
    }
}
