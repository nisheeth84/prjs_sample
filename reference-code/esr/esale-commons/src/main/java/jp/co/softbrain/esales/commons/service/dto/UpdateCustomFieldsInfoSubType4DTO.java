package jp.co.softbrain.esales.commons.service.dto;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO need for UpdateCustomFieldsInfo
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class UpdateCustomFieldsInfoSubType4DTO implements Serializable {
    
    private static final long serialVersionUID = 7657795790729650488L;

    private String target;
    
    private Integer format;
    
    private String fieldName;
    
    private Long fieldId;
    
    private Long relationId;
    
    private Long fieldBelong;
    
}
