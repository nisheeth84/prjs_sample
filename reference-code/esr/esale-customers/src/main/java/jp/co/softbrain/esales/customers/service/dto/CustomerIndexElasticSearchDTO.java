package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO to get data for elastic search
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CustomerIndexElasticSearchDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5035197964278310573L;
    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

    /**
     * customerAliasName
     */
    private String customerAliasName;

    /**
     * customerParent
     */
    private String customerParent;

    /**
     * phoneNumber
     */
    private String phoneNumber;

    /**
     * zipCode
     */
    private String zipCode;

    /**
     * address
     */
    private String address;

    /**
     * building
     */
    private String building;

    /**
     * customerAddress
     */
    private String customerAddress;

    /**
     * url
     */
    private String url;

    /**
     * memo
     */
    private String memo;

    /**
     * customerData
     */
    private String customerData;

}
