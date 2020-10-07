package jp.co.softbrain.esales.uaa.web.rest;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.xray.AWSXRay;
import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.uaa.service.MailService;
import jp.co.softbrain.esales.uaa.service.UaPasswordResetAuthKeyService;
import jp.co.softbrain.esales.uaa.service.UaPasswordsService;
import jp.co.softbrain.esales.uaa.service.dto.PasswordChangeDTO;
import jp.co.softbrain.esales.uaa.service.dto.UserDTO;
import jp.co.softbrain.esales.uaa.web.rest.vm.KeyAndPasswordVM;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
@XRayEnabled
public class AccountResource {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    @Autowired
    private UaPasswordsService uaPasswordsService;

    @Autowired
    private UaPasswordResetAuthKeyService uaPasswordResetAuthKeyService;

    @Autowired
    private MailService mailService;

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    @GetMapping("/account")
    public ResponseEntity<UserDTO> getAccount() {
        return ResponseEntity.ok(uaPasswordsService.getUserWithAuthorities()
            .orElseThrow(() -> new RuntimeException("account.reset.messages.user-notfound")));
    }

    /**
     * {@code POST  /account/change-password} : changes the current user's password.
     *
     * @param passwordChangeDto current and new password.
     */
    @PostMapping(path = "/account/change-password")
    public ResponseEntity<Object> changePassword(@Valid @RequestBody PasswordChangeDTO passwordChangeDto) {
        return ResponseEntity.ok(uaPasswordsService.processChangePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword()));
    }

    /**
     * {@code POST   /account/reset-password/init} : Send an email to reset the password of the user.
     *
     * @param employeeCode the employeeCode of the user.
     */
    @PostMapping(path = "/account/reset-password/init")
    public ResponseEntity<Object> requestPasswordReset(@RequestBody String employeeCode) {
        log.debug("Request change password by employeeCode: {}", employeeCode);
        AWSXRay.beginSegment("Uaa");
       mailService.sendPasswordResetMail(
               uaPasswordsService.requestPasswordReset(employeeCode)
               .orElseThrow(() -> new RuntimeException("account.reset.messages.user-notfound"))
       );
       return ResponseEntity.ok(true);
    }

    /**
     * {@code POST   /account/reset-password/checkkey} : Check reset key
     *
     * @param key reset reset password
     */
    @PostMapping(path = "/account/reset-password/checkkey")
    public ResponseEntity<Object> checkKeyPasswordReset(@RequestBody String key) {
        log.debug("Check resetkey : {}", key);
        return ResponseEntity.ok(uaPasswordResetAuthKeyService.checkKeyPasswordReset(key).isPresent());
    }

    /**
     * {@code POST   /account/reset-password/finish} : Finish to reset the password of the user.
     *
     * @param keyAndPassword the generated key and the new password.
     */
    @PostMapping(path = "/account/reset-password/finish")
    public ResponseEntity<Object> finishPasswordReset(@Valid @RequestBody KeyAndPasswordVM keyAndPassword) {
        log.debug("finish change password");
        return ResponseEntity.ok(uaPasswordsService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey()).isPresent());
    }
}
