/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

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
    private List<SearchValueTypeDTO> searchValue;

    /**
     * fieldType
     */
    private Integer fieldType;

}
