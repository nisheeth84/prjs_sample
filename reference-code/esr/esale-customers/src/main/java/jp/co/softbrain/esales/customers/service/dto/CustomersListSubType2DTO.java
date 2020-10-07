
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * List inDTO for createList
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class CustomersListSubType2DTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5344806443812634811L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * searchType
     */
    private Integer searchType;

    /**
     * searchOption
     */
    private Integer searchOption;

    /**
     * searchValue
     */
    private String fieldValue;

    /**
     * fieldType
     */
    private Integer fieldType;

    /**
     * fieldOrder
     */
    private Integer fieldOrder;
    
    /**
     * timeZoneOffset
     */
    private Integer timeZoneOffset;

}
