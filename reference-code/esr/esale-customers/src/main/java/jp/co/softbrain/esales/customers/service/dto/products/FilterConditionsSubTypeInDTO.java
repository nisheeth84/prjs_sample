package jp.co.softbrain.esales.customers.service.dto.products;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;


/**
 * A DTO FilterConditionsSubTypeInDTO for filter search
 *
 * @author trungbh
 */
@Data
@EqualsAndHashCode
public class FilterConditionsSubTypeInDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7347178178118457460L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldName
     */
    private String fieldName;

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
    private KeyValue searchValue;

    /**
     * The SearchItem fieldType
     */
    private String fieldType;

    /**
     * The SearchItem isDefault
     */
    private String isDefault;

    /**
     * isNested
     */
    private Boolean isNested = false;

    /**
     * The SearchItem fieldValue
     */
    private String fieldValue;

    /**
     * The SearchItem timeZoneOffset
     */
    private Integer timeZoneOffset;

}
