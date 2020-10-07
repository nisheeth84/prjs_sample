package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Get Notification Setting Out
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class GetNotificationSettingOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -903096198073406962L;

    /**
     * employeeID
     */
    private Long employeeId;

    /**
     * email
     */
    private String email;

    /**
     * notification_time of table notification_setting
     */
    private Long notificationTime;

    /**
     * data
     */
    private List<GetNotificationSettingSubType1DTO> data;

}
