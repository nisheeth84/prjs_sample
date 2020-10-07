package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetCustomersOutCustomerRelations
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetCustomersOutCustomerRelations implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2014574471328634714L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * customerBusinessId
     */
    private Integer customerBusinessMainId;

    /**
     * customerBusinessName
     */
    private String customerBusinessMainName;

    /**
     * customerBusinessId
     */
    private Integer customerBusinessSubId;

    /**
     * customerBusinessName
     */
    private String customerBusinessSubName;

    /**
     * customerBusinessName
     */
    private Long parentId;

}
