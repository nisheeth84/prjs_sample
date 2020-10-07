package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class SummaryFilterValueDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4083592492285710480L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * fieldType
     */
    private Boolean isNested;

    /**
     * fieldType
     */
    private Integer fieldType;

    /**
     * isDefault
     */
    private Boolean isDefault;

    /**
     * fieldValue
     */
    private String fieldValue;

    /**
     * searchType
     */
    private Long searchType;

    /**
     * searchOption
     */
    private Long searchOption;

    /**
     * timeZoneOffset
     */
    private Integer timeZoneOffset;
}
