package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO response from API delete-account-cognito
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class DeleteAccountCognitoResponseDTO implements Serializable {

    private static final long serialVersionUID = -5079444656483325084L;

    private String message;
}
