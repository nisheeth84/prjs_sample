/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Type DTO of search value
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SearchValueTypeDTO extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4681416848302655427L;

}
