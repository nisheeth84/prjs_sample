package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The UserInfo class packages the information of user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {

    private String username;

    private String employeeSurname;

    private String employeeName;

    private String email;

    private Boolean isModifyEmployee;

    private Boolean isAccessContract;

    private String tenantName;
}
