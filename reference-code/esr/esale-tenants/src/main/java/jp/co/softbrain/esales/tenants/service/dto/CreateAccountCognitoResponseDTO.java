package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO response from API create-account-cognito
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class CreateAccountCognitoResponseDTO implements Serializable {

    private static final long serialVersionUID = -629066837399899096L;

    private String message;

    private String userName;
}
