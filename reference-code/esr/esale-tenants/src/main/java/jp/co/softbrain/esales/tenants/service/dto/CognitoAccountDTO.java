package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response from API get-account-cognito
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CognitoAccountDTO implements Serializable {

    private static final long serialVersionUID = -5375518241321942522L;

    private String userName;

    private String employeeSurname;

    private String employeeName;

    private String email;

    private Boolean isAccessContract;

    private Boolean isModifyEmployee;
}
