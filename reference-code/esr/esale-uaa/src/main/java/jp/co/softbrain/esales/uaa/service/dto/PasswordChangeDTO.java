package jp.co.softbrain.esales.uaa.service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import jp.co.softbrain.esales.uaa.config.ConstantsUaa;
import jp.co.softbrain.esales.uaa.web.rest.vm.ManagedUserVM;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO representing a password change required data - current and new password.
 */
@Data
@EqualsAndHashCode
public class PasswordChangeDTO {

    @NotBlank
    private String currentPassword;

    @NotBlank
    @Pattern(regexp = ConstantsUaa.PASSWORD_REGEX)
    @Size(min = ManagedUserVM.PASSWORD_MIN_LENGTH, max = ManagedUserVM.PASSWORD_MAX_LENGTH)
    private String newPassword;
}
