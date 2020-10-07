package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO of api getCustomerSuggestion
 * 
 * @author nguyenductruong
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetCustomerSuggestionResultSqlMappingDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -400532129938597571L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * address
     */
    private String address;

    /**
     * parentCustomerId
     */
    private Long parentCustomerId;

    /**
     * parentCustomerName
     */
    private String parentCustomerName;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
