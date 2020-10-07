package jp.co.softbrain.esales.tenants.service.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * UpdateAccountCognitoInfo
 *
 * @author tongminhcuong
 */
@Data
public class UpdateAccountCognitoInfo implements Serializable {

    private static final long serialVersionUID = -8901787964369892306L;

    private String employeeSurname;

    private String employeeName;

    private String email;

    private String password;

    private Boolean isAccessContract;
}
