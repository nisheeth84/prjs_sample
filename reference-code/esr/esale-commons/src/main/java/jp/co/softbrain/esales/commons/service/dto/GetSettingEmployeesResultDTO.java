package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Get setting employees result DTO
 *
 * @author lehuuhoa
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetSettingEmployeesResultDTO implements Serializable {

    private static final long serialVersionUID = -5977396230264251002L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * notificationType
     */
    private Long notificationType;

    /**
     * notificationSubtype
     */
    private Long notificationSubtype;

    /**
     * isNotification
     */
    private Boolean isNotification;

    /**
     * notificationSubtypeName
     */
    private String notificationSubtypeName;

    /**
     * notificationTypeName
     */
    private String notificationTypeName;

    /**
     * email
     */
    private String email;

    /**
     * notification Time
     */
    private Long notificationTime;

}
