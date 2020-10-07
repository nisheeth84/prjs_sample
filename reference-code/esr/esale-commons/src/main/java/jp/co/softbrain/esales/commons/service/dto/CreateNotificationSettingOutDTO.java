package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * Create Notification Setting Out DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class CreateNotificationSettingOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 420092499759230005L;

    /**
     * employeeId
     */
    private Long employeeId;
}
