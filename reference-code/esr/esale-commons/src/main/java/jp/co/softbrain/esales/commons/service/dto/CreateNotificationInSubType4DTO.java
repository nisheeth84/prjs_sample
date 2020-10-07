package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationInSubType4DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CreateNotificationInSubType4DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 16427624623626L;

    /**
     * customerId
     */
    private Long customerId;
    /**
     * customerName
     */
    private String customerName;

}
