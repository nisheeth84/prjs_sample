package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class out DTO sub type for API getCustomerLayout
 */
@Data
@EqualsAndHashCode
public class CustomerLayoutFieldItemDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4870902818563290422L;

    /**
     * itemId
     */
    private Long itemId;

    /**
     * isAvailable
     */
    private Boolean isAvailable;

    /**
     * itemOrder
     */
    private Integer itemOrder;

    /**
     * isDefault
     */
    private Boolean isDefault;

    /**
     * itemLabel
     */
    private String itemLabel;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    /**
     * itemParentId
     */
    private Long itemParentId;

    private List<CustomerLayoutFieldItemDTO> fieldItemChilds = new ArrayList<>();

}
