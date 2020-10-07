
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SearchCondtion
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class SearchCondtion implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4959124377948256352L;

    /**
     * fieldType
     */
    private String fieldType;

    /**
     * isDefault
     */
    private Boolean isDefault;

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
    private List<KeyValue> searchValue;
}
