package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerOutSubType16DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class FieldItemDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -750574210461365907L;

    /**
     * itemId
     */
    private Long itemId;

    /**
     * itemLabel
     */
    private String itemLabel;

}
