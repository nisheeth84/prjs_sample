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
public class UpdateCustomFieldsInfoSubType1DTO implements Serializable {

    private static final long serialVersionUID = 3751731524961034687L;

    private Integer fieldBelong;

    private Long searchKey;

    private List<UpdateCustomFieldsInfoSubType2DTO> itemReflect;
}
