package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * OrderBy
 * 
 * @author haodv
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class OrderBy implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5072217096770253738L;

    /**
     * The field name
     */
    private String fieldName;

    /**
     * The orderType
     */
    private String orderType;

}
