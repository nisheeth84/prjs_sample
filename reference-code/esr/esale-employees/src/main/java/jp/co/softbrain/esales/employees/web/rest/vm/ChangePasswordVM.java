package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;

import lombok.Data;

@Data
public class ChangePasswordVM implements Serializable {

    private static final long serialVersionUID = 4940875455044828730L;
    /**
     * The username
     */
    private String username;
    /**
     * The oldPassword
     */
    private String oldPassword;
    /**
     * The newPassword
     */
    private String newPassword;
    
}
