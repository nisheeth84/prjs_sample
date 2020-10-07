package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Notification Email DTO
 * 
 * @author DatDV
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationEmailDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4209539703828240292L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * email
     */
    private String email;

}
