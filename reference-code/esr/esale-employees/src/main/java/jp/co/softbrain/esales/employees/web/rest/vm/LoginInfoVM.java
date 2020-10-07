package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;

import lombok.Data;

@Data
public class LoginInfoVM implements Serializable {

    private static final long serialVersionUID = 6983782860586111118L;
    
    private String username;
    private String email;
    private String employeeName;
    private int remainingDays;
    private long employeeId;
    private String languageCode;
    private String timezoneName;
    private String formatDate;
    private String tenantId;
    private Boolean isAdmin;
    private Boolean isAccessContract;

    private String accessToken;
    private String idToken;
    private String refreshToken;
    private Boolean newPasswordRequired = false;
    
}
