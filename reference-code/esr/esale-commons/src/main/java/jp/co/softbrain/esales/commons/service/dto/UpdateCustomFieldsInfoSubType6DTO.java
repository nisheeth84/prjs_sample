package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO need for UpdateCustomFieldsInfo
 * 
 */
@Data
@EqualsAndHashCode
public class UpdateCustomFieldsInfoSubType6DTO implements Serializable {
    
    private static final long serialVersionUID = 3783171119261810782L;
    
    private Boolean isDisplay;
    
    private String backwardColor;
    
    private String backwardText;
    
    private String forwardColor;
    
    private String forwardText;

}
