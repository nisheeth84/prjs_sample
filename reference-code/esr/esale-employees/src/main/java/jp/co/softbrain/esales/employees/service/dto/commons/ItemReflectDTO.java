package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node lookupData.itemReflect of response from API getCustomFieldsInfo
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class ItemReflectDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7844824543254307224L;

    @JsonAlias("field_id")
    private Long fieldId;

    @JsonAlias("field_label")
    private String fieldLabel;

    @JsonAlias("item_reflect")
    private Long itemReflect;
}
