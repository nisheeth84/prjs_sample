package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO response from API update-account-cognito
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class UpdateAccountCognitoResponseDTO implements Serializable {

    private static final long serialVersionUID = -4495119346550391807L;

    private String message;
}
