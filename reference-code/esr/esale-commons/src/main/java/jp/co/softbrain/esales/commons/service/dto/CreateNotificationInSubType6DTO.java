package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationInSubType6DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CreateNotificationInSubType6DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1125162477L;
    /**
     * customerId
     */
    private Long customerId;
    /**
     * customerName
     */
    private String customerName;
    /**
     * receivers
     */
    private List<ReceiverDTO> receivers;
    /**
     * customerMode
     */
    private int customerMode;

}
