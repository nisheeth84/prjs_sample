package jp.co.softbrain.esales.employees.web.rest;


import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.micrometer.core.instrument.util.StringUtils;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.oauth2.UserOnlineState;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.AuthenticationService;
import jp.co.softbrain.esales.employees.service.LicenseService;
import jp.co.softbrain.esales.employees.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.CognitoSettingsDTO;
import jp.co.softbrain.esales.employees.service.dto.CognitoUserInfo;
import jp.co.softbrain.esales.employees.service.dto.GetStatusContractOutDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.employees.web.rest.vm.ChangePasswordVM;
import jp.co.softbrain.esales.employees.web.rest.vm.LoginInfoVM;
import jp.co.softbrain.esales.employees.web.rest.vm.LoginVM;
import jp.co.softbrain.esales.employees.web.rest.vm.ResetPasswordVM;
import jp.co.softbrain.esales.employees.web.rest.vm.response.CheckInvalidLicenseResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.ResetPasswordResponse;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import software.amazon.awssdk.services.cognitoidentityprovider.model.IdentityProviderTypeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameAttributeType;

/**
 * Rest API for Account
 */
@RestController
public class AccountResource {

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TokenStore tokenStore;

    @Autowired
    private UserOnlineState userOnlineState;

    @Autowired
    private LicenseService licenseService;

    /**
     * API register new account
     *
     * @return
     */
    @PostMapping(path = "/register/userpool")
    public ResponseEntity<Boolean> createUserPoolId() {

        String userPoolId = authenticationService.createUserPoolId();

        if (StringUtils.isBlank(userPoolId)) {
            return ResponseEntity.ok(false);
        }

        // create identify providers
        Map<String, String> providerDetails = new HashMap<>();
        providerDetails.put("client_id", "515992242880-j70q84qvouqa5c0s94dl1tg6cb7rmc0u.apps.googleusercontent.com");
        providerDetails.put("client_secret", "HA0fzeRUfUww9h_UByaiCbUL");
        providerDetails.put("authorize_scopes", "email");

        Map<String, String> attributeMapping = new HashMap<>();
        attributeMapping.put("email", UsernameAttributeType.EMAIL.toString());

        String providerName = IdentityProviderTypeType.GOOGLE.toString();
        String providerType = IdentityProviderTypeType.GOOGLE.toString();

        if (authenticationService.createIdentityProvider(providerDetails, attributeMapping, providerName, providerType,
                userPoolId)) {

            // create user pool client
            List<String> supportedIdentityProviders = new ArrayList<>();
            supportedIdentityProviders.add(providerName);
            String clientId = authenticationService.createUserPoolClient(userPoolId, supportedIdentityProviders);

            if (StringUtils.isBlank(clientId)) {
                return ResponseEntity.ok(false);
            }
            Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

            CognitoSettingsDTO cognitoSettingsDTO = new CognitoSettingsDTO();
            cognitoSettingsDTO.setUserPoolId(userPoolId);
            cognitoSettingsDTO.setClientId(clientId);
            cognitoSettingsDTO.setCreatedUser(employeeId == null ? 1 : employeeId);
            cognitoSettingsDTO.setCreatedDate(Instant.now());
            cognitoSettingsDTO.setUpdatedUser(employeeId == null ? 1 : employeeId);
            cognitoSettingsDTO.setUpdatedDate(Instant.now());

            restOperationUtils.executeCallPublicApi(
                    Constants.PathEnum.TENANTS, "/public/api/create-cognito-setting", HttpMethod.POST, cognitoSettingsDTO,
                    Boolean.class, TenantContextHolder.getTenant());
        }

        return ResponseEntity.ok(true);
    }

    /**
     * API create group
     *
     * @return
     */
    @PostMapping(path = "/register/group")
    public ResponseEntity<Boolean> createGroup() {
        authenticationService.createGroup(null);
        return ResponseEntity.ok(true);
    }

    /**
     * API register new account
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/register/account", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> createNewUser(@RequestBody CognitoUserInfo input) {
        if (StringUtils.isBlank(input.getTenantId())) {
            return ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(authenticationService.createNewUser(input));
    }

    /**
     * API update account
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/api/account/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> updateUserAttributes(@RequestBody CognitoUserInfo input) {
        return ResponseEntity.ok(authenticationService.updateUserAttributes(input, null));
    }

    /**
     * API delete account
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/api/account/delete", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> deleteUser(@RequestBody CognitoUserInfo input) {
        return ResponseEntity.ok(authenticationService.deleteUser(input.getUsername(), null, null, true));
    }

    /**
     * API register new account
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/api/change-email", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> changeEmail(@RequestBody CognitoUserInfo input) {
        CognitoSettingInfoDTO cognitoSettingsDTO = authenticationService.getCognitoSetting();
        return ResponseEntity.ok(authenticationService.changeEmail(input.getUsername(), input.getEmail(),
                cognitoSettingsDTO.getUserPoolId()));
    }

    // ======================== END API for TEST ========================================

    /**
     * API confirm register new account
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/register/account/confirm", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> changeFromTemporaryPassword(@RequestBody ChangePasswordVM input) {
        return ResponseEntity.ok(authenticationService.changeFromTemporaryPassword(input.getUsername(),
                input.getOldPassword(), input.getNewPassword()));
    }

    /**
     * API login
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/auth/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginInfoVM> userLogin(@RequestBody LoginVM input) {
        return ResponseEntity.ok(authenticationService.userLogin(input.getUsername(), input.getPassword()));
    }

    /**
     * API forgot password
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/auth/forgot", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> forgotPassword(@RequestBody ResetPasswordVM input) {
        return ResponseEntity.ok(authenticationService.forgotPassword(input.getUsername()));
    }

    /**
     * API forgot password
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/auth/reset-password", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody ResetPasswordVM input) {
        boolean isSuccess = authenticationService.resetPassword(input.getUsername(), input.getResetCode(),
                input.getNewPassword());
        ResetPasswordResponse response = new ResetPasswordResponse();
        response.setSuccess(isSuccess);
        return ResponseEntity.ok(response);
    }

    /**
     * API logout
     *
     * @return
     */
    @PostMapping(path = "/auth/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> userLogout() {
        userOnlineState.removeCachedAuthState(tokenStore);
        authenticationService.userLogout();
        return ResponseEntity.noContent().build();
    }

    /**
     * API change password
     *
     * @param input
     * @return
     */
    @PostMapping(path = "/api/change-password", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> changePassword(@RequestBody ChangePasswordVM input) {
        String username = input.getUsername();
        if (StringUtils.isBlank(username)) {
            username = SecurityUtils.getCurrentUserLogin().orElse("");
        }
        return ResponseEntity
                .ok(authenticationService.changePassword(username, input.getOldPassword(), input.getNewPassword()));
    }

    /**
     * API verify login state
     *
     * @param site
     * @param request
     * @return
     */
    @GetMapping(path = "/auth/verify", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> verify(@Nullable @Param("site") String site,
            @Autowired HttpServletRequest request) {
        return ResponseEntity
                .ok(authenticationService.verify(site, request.getHeader("User-Agent"), request.getRemoteAddr()));
    }

    /**
     * Get the information displayed on the login screen.
     *
     * @return respone
     */
    @PostMapping(path = "/api/get-status-contract", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetStatusContractOutDTO> getStatusContract() {
        return ResponseEntity.ok(authenticationService.getStatusContract());
    }

    /**
     * Check license info and its status
     */
    @PostMapping(path = "/api/check-invalid-license", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CheckInvalidLicenseResponse> checkInvalidLicense() {
        return ResponseEntity.ok(licenseService.checkInvalidLicense(null));
    }

}
