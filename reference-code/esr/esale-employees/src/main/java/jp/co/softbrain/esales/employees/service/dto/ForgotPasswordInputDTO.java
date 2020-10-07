package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Input class contains data for forgotPassword
 */
@Data
@EqualsAndHashCode
public class ForgotPasswordInputDTO implements Serializable {

    private static final long serialVersionUID = 1827787671443421298L;

    /**
     * the email
     */
    private String email;
    /**
     * the username
     */
    private String username;

    /**
     * the reset code
     */
    private String resetCode;

    /**
     * the url reset pass
     */
    private String url;
}
