package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNotificationDetailSettingOutDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -7076822259430096385L;

    /**
     * The employeeId
     */
    private Long employeeId;
}
