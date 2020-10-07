package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * TaskDataJsonTypeDTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TaskDataJsonTypeDTO extends KeyValue implements Serializable {

    private static final long serialVersionUID = -8471879224232715901L;

    /**
     * FieldTypeEnum
     */
    private Integer fieldType;

}
