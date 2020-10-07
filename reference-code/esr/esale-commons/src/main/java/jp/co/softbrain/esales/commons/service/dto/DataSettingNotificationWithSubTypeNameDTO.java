package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Data setting notification DTO
 *
 * @author nguyenvietloi
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class DataSettingNotificationWithSubTypeNameDTO extends  DataSettingNotificationDTO implements Serializable {

    private static final long serialVersionUID = 8716027666838756146L;

    private String notificationSubtypeName;
}
