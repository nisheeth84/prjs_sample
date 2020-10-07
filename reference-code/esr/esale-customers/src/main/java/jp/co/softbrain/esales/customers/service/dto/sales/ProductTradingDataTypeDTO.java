package jp.co.softbrain.esales.customers.service.dto.sales;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;

/**
 * The KeyValue class to map data for SearchConditions
 *
 * @author thanhdv
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductTradingDataTypeDTO extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5346841870840397772L;

    /**
     * FieldTypeEnum
     */
    private String fieldType;
}
