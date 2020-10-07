package jp.co.softbrain.esales.employees.service.dto.businesscards;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The KeyValue class to map data for SearchConditions
 *
 * @author trungbh
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class BusinessCardsDataTypeDTO extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6686557382241077660L;

    /**
     * FieldTypeEnum
     */
    private Integer fieldType;

}
