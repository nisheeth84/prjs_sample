package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO of api getCustomersTab
 * 
 * @author nguyenductruong
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetCustomersTabSubType3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -310595026838597571L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * phoneNumber
     */
    private String phoneNumber;

    /**
     * building
     */
    private String building;

    /**
     * address
     */
    private String address;

    /**
     * businessMainName
     */
    private String businessMainName;

    /**
     * businessSubName
     */
    private String businessSubName;

    /**
     * createdDate
     */
    private Instant createdDate;

    /**
     * updatedDate
     */
    private Instant updatedDate;

}
