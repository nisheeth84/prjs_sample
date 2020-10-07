package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateNotificationInSubType6DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
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
