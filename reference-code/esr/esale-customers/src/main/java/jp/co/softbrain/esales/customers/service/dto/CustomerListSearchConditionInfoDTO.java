/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for api getListSearchCondition
 * 
 * @author nguyenhaiduong
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CustomerListSearchConditionInfoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6954887754397678678L;

    /**
     * The searchContentId
     */
    private Long customerListSearchConditionId;

    /**
     * The groupId
     */
    private Long customerListId;

    /**
     * The fieldId
     */
    private Long fieldId;

    /**
     * The searchType
     */
    private Integer searchType;

    /**
     * The fieldOrder
     */
    private Integer fieldOrder;

    /**
     * The searchOption
     */
    private Integer searchOption;

    /**
     * The fieldValue
     */
    private String fieldValue;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * field label
     */
    private String fieldLabel;
    /**
     * fieldType
     */
    private Integer fieldType;
}
