package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO class api getChildCustomers
 * 
 * @author nguyenductruong
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetChildCustomersSupType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3740998113122745547L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * level
     */
    private Integer level;

    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
