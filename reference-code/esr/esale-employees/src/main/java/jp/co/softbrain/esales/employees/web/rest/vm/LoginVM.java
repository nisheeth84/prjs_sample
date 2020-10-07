package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;

import lombok.Data;

@Data
public class LoginVM implements Serializable {

    private static final long serialVersionUID = -567929345716660762L;

    /**
     * The username
     */
    private String username;
    /**
     * The username
     */
    private String password;
    /**
     * The username
     */
    private String rememberMe;
}
