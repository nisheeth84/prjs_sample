package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO for API updateNotificationAddress
 * 
 * @author QuangLV
 */
@Data
@EqualsAndHashCode
public class UpdateNotificationAddressOutDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 3133775172557969859L;

    /**
     * The employeeId
     */
    private Long employeeId;
}
