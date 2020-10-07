package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * PushNotificationDTO
 * 
 * @author Admin
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PushNotificationDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -2939670495765302943L;

    private Long employeeId;

    private String deviceUniqueId;

    private String deviceToken;

    private String endpoint;
    
    private String tenantId;

    private Boolean isLogged;
}
