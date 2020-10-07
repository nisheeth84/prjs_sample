package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.CognitoUserInfo;
import jp.co.softbrain.esales.tenants.service.dto.GetUserInfoByTokenResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.RefreshTokenResponseDTO;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse;


/**
 * An interface for authentication. This interface is designed to abstract the
 * actual implementation of
 * authentication.
 */
public interface AuthenticationService {


    /**
     * Create user pool
     *
     * @param poolName name of user pool
     * @return user pool id
     */
    String createUserPool(String poolName);


    /**
     * Create user pool domain
     *
     * @param userPoolId user pool id
     * @param domainName domain name
     */
    void createUserPoolDomain(String userPoolId, String domainName);

    /**
     * Create user group
     *
     * @param userPoolId user pool id
     */
    void createUserGroup(String userPoolId);

    /**
     * Add user to group
     *
     * @param userPoolId user pool id
     * @param username user name
     */
    void addUserToGroup(String userPoolId, String username);

    /**
     * Create user pool client and add support identify providers
     *
     * @param userPoolId user pool id
     * @param tenantName name of tenant
     * @param supportedIdentityProviders supported identity providers
     * @return user pool client id
     */
    String createUserPoolClient(String userPoolId, String tenantName, List<String> supportedIdentityProviders);

    /**
     * Create a new user.
     * When a user is created in the Cognito user pool, the user account will be
     * initially inactive. An email with a
     * temporary password will be sent to the user's email address. The user
     * will use this temporary password to login
     * (via the login page). They will then be redirected to the change password
     * page.
     * This function assumes that the user does not exist (the user name and
     * email should be unique).
     * The caller should check whether the user already exists and handle that
     * with the appropriate logic.
     * If the user already exists, this method will throw an exception.
     * The email_verified attribute (set to true) is very important. Without
     * setting this attribute, the email address will
     * be treated as unverified. If the email is not verified, an attempt to
     * reset the password will result in an unverified
     * email error.
     *
     * @param userInfo The CognitoUserInfo object
     *        emailAddress the user's email address. This will be the email
     *        address that the temporary password will be sent to.
     * @param userPoolId UserPoolId
     * @return AdminCreateUserResponse
     */
    AdminCreateUserResponse createUser(String userPoolId, CognitoUserInfo userInfo);

    /**
     * Delete user pool
     *
     * @param userPoolId user pool id
     * @param clientId user pool client id
     * @param domainName domain name
     * @return true if delete success
     */
    boolean deleteUserPool(String userPoolId, String clientId, String domainName);

    /**
     * Delete user pool domain
     *
     * @param userPoolId user pool id
     * @param domainName domain name
     * @return true if delete success
     */
    boolean deleteUserPoolDomain(String userPoolId, String domainName);

    /**
     * Delete user pool client
     *
     * @param userPoolId user pool id
     * @param clientId user pool client id
     * @return true if delete success
     */
    boolean deleteUserPoolClient(String userPoolId, String clientId);

    /**
     * Get new token from Cognito
     *
     * @param contractTenantId id of contract
     * @param refreshToken refresh token
     * @return new token
     */
    RefreshTokenResponseDTO refreshToken(String contractTenantId, String refreshToken);

    /**
     * Get user information by token
     *
     * @param token token
     * @return {@link GetUserInfoByTokenResponseDTO}
     */
    GetUserInfoByTokenResponseDTO getUserInfoByToken(String token);
}
