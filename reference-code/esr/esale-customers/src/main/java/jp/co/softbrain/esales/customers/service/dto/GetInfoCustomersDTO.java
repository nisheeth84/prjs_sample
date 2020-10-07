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
public class GetInfoCustomersDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7211346774172925694L;

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
     * businessMainId
     */
    private Integer businessMainId;

    /**
     * businessSubId
     */
    private Integer businessSubId;

    /**
     * createdDate
     */
    private Instant createdDate;

    /**
     * udpatedDate
     */
    private Instant updatedDate;

}
