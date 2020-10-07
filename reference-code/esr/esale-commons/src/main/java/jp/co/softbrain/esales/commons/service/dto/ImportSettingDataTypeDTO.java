package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The KeyValue class to map data for ImportSetting jsonb entity
 *
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class ImportSettingDataTypeDTO extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -279104138506898878L;
    /**
     * FieldTypeEnum
     */
    private Integer fieldType;

}
