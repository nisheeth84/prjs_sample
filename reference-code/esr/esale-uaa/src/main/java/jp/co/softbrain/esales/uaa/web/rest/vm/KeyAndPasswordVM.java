package jp.co.softbrain.esales.uaa.web.rest.vm;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import jp.co.softbrain.esales.uaa.config.ConstantsUaa;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * View Model object for storing the user's key and password.
 */
@Data
@EqualsAndHashCode
public class KeyAndPasswordVM {

    private String key;

    @NotBlank
    @Pattern(regexp = ConstantsUaa.PASSWORD_REGEX)
    @Size(min = ManagedUserVM.PASSWORD_MIN_LENGTH, max = ManagedUserVM.PASSWORD_MAX_LENGTH)
    private String newPassword;
}
