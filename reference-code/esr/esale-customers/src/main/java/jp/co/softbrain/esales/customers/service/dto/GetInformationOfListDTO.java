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
 * GetInformationOfListDTO
 *
 * @author lequyphuc
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetInformationOfListDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3523525252421412L;

    /**
     * isAutoList
     */
    private Boolean isAutoList;

    /**
     * isOverWrite
     */
    private Boolean isOverWrite;

    /**
     * customerListSearchConditionId
     */
    private Long customerListSearchConditionId;

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
     * timeZoneOffset
     */
    private Integer timeZoneOffset;

}
