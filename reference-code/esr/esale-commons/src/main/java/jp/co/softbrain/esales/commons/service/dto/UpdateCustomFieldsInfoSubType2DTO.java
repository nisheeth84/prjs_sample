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
public class UpdateCustomFieldsInfoSubType2DTO implements Serializable {

    private static final long serialVersionUID = -8124422572372245562L;

    private Long fieldId;

    private String fieldLabel;

    private Long itemReflect;

}
