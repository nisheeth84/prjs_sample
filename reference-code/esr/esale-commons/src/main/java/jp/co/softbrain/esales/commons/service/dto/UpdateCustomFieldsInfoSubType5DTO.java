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
public class UpdateCustomFieldsInfoSubType5DTO implements Serializable {


    private static final long serialVersionUID = 7297436832741033210L;

    private String target;

    private Integer format;
}
