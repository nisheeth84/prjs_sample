package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Map;

import jp.co.softbrain.esales.employees.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.CognitoUserInfo;
import jp.co.softbrain.esales.employees.service.dto.GetStatusContractOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.LoginInfoVM;

/**
 * An interface for authentication. This interface is designed to abstract the
 * actual implementation of
 * authentication.
 */
public interface AuthenticationService {

    /**
     * create user pool id
     *
     * @return
     */
    public String createUserPoolId();

    /**
     * create group
     *
     * @param userPoolId
     * @return
     */
    public boolean createGroup(String userPoolId);

    /**
     * delete user pool
     *
     * @param userPoolId
     * @param clientId
     * @return
     */
    public boolean deleteUserPool(String userPoolId, String clientId);

    /**
     * delete user pool client
     *
     * @param userPoolId
     * @param clientId
     * @return
     */
    public boolean deleteUserPoolClient(String userPoolId, String clientId);

    /**
     * Create Identify providers
     *
     * @param providerDetails
     * @param attributeMapping
     * @param providerName
     * @param providerType
     * @param userPoolId
     * @return
     */
    public boolean createIdentityProvider(Map<String, String> providerDetails, Map<String, String> attributeMapping,
            String providerName, String providerType, String userPoolId);

    /**
     * Create user pool client and add support identify providers
     *
     * @param userPoolId
     * @param supportedIdentityProviders
     * @return
     */
    public String createUserPoolClient(String userPoolId, List<String> supportedIdentityProviders);

    /**
     * update Identity Providers
     *
     * @param supportedIdentityProviders
     * @param clientId
     * @param userPoolId
     * @return
     */
    public boolean updateIdentityProvider(List<String> supportedIdentityProviders, String clientId, String userPoolId);

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
     *        UserPoolId
     * @return a UserType object.
     */
    public boolean createNewUser(final CognitoUserInfo userInfo);

    /**
     * Delete an existing user. This code assumes that the operation is
     * logically permitted (a user is only allowed to delete their own account,
     * after password verification).
     *
     * @param userName
     * @param password
     * @param cognitoSetting
     * @param isAdmin
     */
    public boolean deleteUser(String userName, String password, CognitoSettingInfoDTO cognitoSetting, boolean isAdmin);

    /**
     * Find a user by email address.
     *
     * @param email
     * @return
     */
    public CognitoUserInfo findUserByUserName(String email, String userPoolId);

    /**
     * Update user attributes associated with the user information stored in
     * Cognito. Note that the email
     * attribute is updated separately.
     *
     * @param newInfo
     * @param cognitoSetting if null to create it
     */
    public boolean updateUserAttributes(CognitoUserInfo newInfo, CognitoSettingInfoDTO cognitoSetting);

    /**
     * Log a user into the system using Cognito.
     *
     * @param userName
     * @param password
     * @return a LoginInfo object that includes the access token which is used
     *         for user operations like change password.
     */
    public LoginInfoVM userLogin(String userName, String password);

    /**
     * Log the user out.
     */
    public boolean userLogout();

    /**
     * Change the user's password from a temporary password to a new (permanent)
     * password.
     * This function is called to set the password using the temporary password
     * emailed to the user's email
     * address.
     *
     * @param username
     * @param oldPass
     * @param newPass
     * @return
     */
    public boolean changeFromTemporaryPassword(String username, String oldPass, String newPass);

    /**
     * This function is called to reset the user's password if the password has
     * been forgotten. The function will
     * result in an email being sent to the user's email account with a reset
     * code.
     *
     * @param username the user name for the account that should be reset.
     *        Support for resetting the user's password in the event that it was
     *        forgotten.
     * @param userName
     * @param resetCode
     * @throws Exception
     */
    public boolean forgotPassword(final String userName);

    /**
     * Determine whether a user with userName exists in the login database.
     *
     * @param userName
     * @return true if the user exists, false otherwise.
     */
    public boolean hasUser(String userName, String userPoolId);

    /**
     * Admin change password
     *
     * @param username
     * @param newPass
     * @return
     */
    public boolean adminChangePassword(String username, String newPass);

    /**
     * Reset the user's password using a code that they received via email.
     *
     * @param username
     * @param resetCode
     * @param newPass
     */
    public boolean resetPassword(String username, String resetCode, String newPass);

    /**
     * Change the password for a logged in user. Unlike the forgotten password
     * logic, this does not require an
     * authentication code.
     *
     * @param username
     * @param oldPass
     * @param newPass
     */
    public boolean changePassword(String username, String oldPass, String newPass);

    /**
     * Change user's email address. The email address is a special attribute
     * since it will be used for communication
     * with the user.
     * In this code the user is allowed to change their email addressed without
     * verification via an emailed code
     * by setting the "email_verified" attribute to true.
     * Ideally it would be nice to verify the email address via an emailed code,
     * since this assures that the email address
     * is valid and belongs to the user. However, I have been unable to figure
     * out how to do this within the Cognito framework.
     * So we assume that the user entered a correct email address. They can
     * always change it if an error is discovered.
     *
     * @param userName
     * @param newEmailAddr
     * @param userPoolId
     */
    public boolean changeEmail(String userName, String newEmailAddr, String userPoolId);

    /**
     * Get the information displayed on the login screen.
     *
     * @return the DTO
     */
    public GetStatusContractOutDTO getStatusContract();

    /**
     * Get cognito setting
     *
     * @return cognito setting
     */
    public CognitoSettingInfoDTO getCognitoSetting();

    /**
     * Verify current session
     *
     * @return
     */
    public Map<String, Object> verify(String site, String userAgent, String ipAddress);
}
