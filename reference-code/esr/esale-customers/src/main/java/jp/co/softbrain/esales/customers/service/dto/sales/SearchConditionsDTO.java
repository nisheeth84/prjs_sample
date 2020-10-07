package jp.co.softbrain.esales.customers.service.dto.sales;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * The DTO for getProductsTradings
 *
 * @author ThanhDv
 */
@Data
@EqualsAndHashCode
public class SearchConditionsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8221898076905678171L;

    /**
     * fieldType
     */
    private Integer fieldType;

    /**
     * fieldName
     */
    private String fieldName;

    /**
     * fieldValue
     */
    private String fieldValue;

}
