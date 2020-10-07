package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The KeyValue class to map data for SearchConditions
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerDataTypeDTO extends KeyValue implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1647668942836945944L;

    /**
     * FieldTypeEnum
     */
    private String fieldType;
}
