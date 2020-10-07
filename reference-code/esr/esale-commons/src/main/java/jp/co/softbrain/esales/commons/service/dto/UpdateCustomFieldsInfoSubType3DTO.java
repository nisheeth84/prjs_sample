package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO need for UpdateCustomFieldsInfo
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class UpdateCustomFieldsInfoSubType3DTO implements Serializable {

    private static final long serialVersionUID = -9152877473656682940L;

    private Integer fieldBelong;

    private Long fieldId;

    private Integer format;

    private Long displayFieldId;

    private Integer displayTab;

    private List<UpdateCustomFieldsInfoSubType4DTO> displayFields;
    
    private Integer asSelf;

}
