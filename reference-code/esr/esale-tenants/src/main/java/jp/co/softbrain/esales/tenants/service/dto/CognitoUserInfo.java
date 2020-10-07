package jp.co.softbrain.esales.tenants.service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The UserInfo class packages the information associated with a user. This allows the user information
 * to be abstracted from the underlying user implementation for user authentication.
 */
@Data
@NoArgsConstructor
public class CognitoUserInfo {

    private Long tenantId;

    private String tenantName;

    private Long employeeId;

    private String username;

    private String password;

    private String email;

    private String employeeSurname;

    private String employeeName;

    private Long updatedAt;

    private String languageCode;

    private Boolean isAdmin;

    private Boolean isModifyEmployee;

    private Boolean isAccessContract;

    private String timezoneName;

    private String formatDate;

    private String resetCode;

    private String companyName;
}
