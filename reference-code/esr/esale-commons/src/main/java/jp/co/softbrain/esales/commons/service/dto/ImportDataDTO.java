package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The KeyValue class to map data for ImportSettingGetDTO
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ImportDataDTO extends KeyValue implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3245438950872265489L;
    
    /**
     * FieldTypeEnum
     */
    private String fieldType;
}
