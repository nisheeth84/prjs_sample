package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * Info to register cognito account
 *
 * @author tongminhcuong
 */
@Data
public class CreateAccountCognitoRequestDTO implements Serializable {

    private static final long serialVersionUID = 4106275037138375045L;

    private String contractTenantId;

    private String employeeSurname;

    private String employeeName;

    private String email;

    private String password;
}
