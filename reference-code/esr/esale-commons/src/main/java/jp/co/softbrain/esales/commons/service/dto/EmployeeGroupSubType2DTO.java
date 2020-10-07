package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The keyValue class to map data for EmployeesGroupIn
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class EmployeeGroupSubType2DTO implements Serializable {
    private static final long serialVersionUID = 2384648090159054328L;

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
     * fieldOrder
     */
    private Integer fieldOrder;

    /**
     * searchValue
     */
    private List<SearchValueTypeDTO> searchValue;

    /**
     * fieldType
     */
    private Integer fieldType;

}
