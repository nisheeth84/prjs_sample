package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;

import lombok.Data;

@Data
public class ResetPasswordVM implements Serializable {

    private static final long serialVersionUID = 4940875455044828730L;
    /**
     * The username
     */
    private String username;
    /**
     * The resetCode
     */
    private String resetCode;
    /**
     * The newPassword
     */
    private String newPassword;
    
}
