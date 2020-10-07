package jp.co.softbrain.esales.employees.service.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The UserInfo class packages the information associated with a user. This allows the user information
 * to be abstracted from the underlying user implementation for user authentication.
 */
@NoArgsConstructor
@Data
public class CognitoUserInfo {

    private String username;
    private String email;
    private String employeeSurname;
    private String employeeName;
    private Date updatedAt;
    private Integer remainingDays;
    private Long employeeId;
    private String languageCode;
    private String companyName;
    private String timezoneName;
    private String formatDate;
    private String tenantId;
    private String password;
    private Boolean isAdmin;
    private Boolean isAccessContract;
    private Boolean isModifyEmployee;
    private String resetCode;

    private String session;
    private String accessToken;
    private String idToken;
    private String refreshToken;
    private String challengeResult;

    private Boolean newPasswordRequired = false;

    // to check
    private Integer employeeStatus;
    private Integer languageId;
    private Boolean isSendMail;
}
