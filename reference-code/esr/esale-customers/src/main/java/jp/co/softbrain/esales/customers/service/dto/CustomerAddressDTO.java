package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for Object customerAddress for API getDataSyncElasticSearch
 * 
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CustomerAddressDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 478650831743258901L;

    /**
     * zipCode
     */
    private String zipCode;

    /**
     * addressName
     */
    private String addressName;

    /**
     * building
     */
    private String buildingName;

    /**
     * address
     */
    private String address;

}
