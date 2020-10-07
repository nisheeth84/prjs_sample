package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Data setting notification DTO
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataSettingNotificationDTO implements Serializable {

    private static final long serialVersionUID = 8716027555838756146L;

    private Long notificationType;

    private Long notificationSubtype;

    private Boolean isNotification;
}
