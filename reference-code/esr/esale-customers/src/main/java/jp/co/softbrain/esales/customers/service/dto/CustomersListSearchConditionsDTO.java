package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link CustomersListSearchConditionsDTO}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersListSearchConditionsDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 8971838611596494475L;

    /**
     * customerListSearchConditionId
     */
    private Long customerListSearchConditionId;

    /**
     * customerListId
     */
    private Long customerListId;

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
    private String searchValue;

    /**
     * fieldOrder
     */
    private Integer fieldOrder;

    /**
     * timeZoneOffset
     */
    private Integer timeZoneOffset;

    /**
     * fieldValue
     */
    private String fieldValue;
}
