package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The KeyValue class to map data for SearchConditions
 *
 * @author tongminhcuong
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerDataType extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 955715861040342945L;

    /**
     * FieldTypeEnum
     */
    private String fieldType;
}
