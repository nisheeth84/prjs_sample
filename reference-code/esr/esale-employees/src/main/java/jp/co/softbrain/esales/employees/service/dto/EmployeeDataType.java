package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The KeyValue class to map data for SearchConditions
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeeDataType extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6686557382241077660L;

    /**
     * FieldTypeEnum
     */
    private String fieldType;
}
