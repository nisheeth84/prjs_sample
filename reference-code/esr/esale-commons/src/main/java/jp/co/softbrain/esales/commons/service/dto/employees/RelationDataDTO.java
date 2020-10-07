package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import jp.co.softbrain.esales.utils.dto.DisplayFieldDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * data of node data.relationData of response from API getEmployeeLayout
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class RelationDataDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1533009332508728281L;

    /**
     * extensionBelong
     */
    @JsonAlias("field_belong")
    private Integer fieldBelong;

    /**
     * relationFormat
     */
    @JsonAlias("field_id")
    private Long fieldId;

    /**
     * relationFormat
     */
    @JsonAlias("format")
    private Integer format;

    /**
     * relationFieldId
     */
    @JsonAlias("display_field_id")
    private Long displayFieldId;

    /**
     * displayTab
     */
    @JsonAlias("display_tab")
    private Integer displayTab;

    /**
     * displayFields
     */
    @JsonAlias("display_fields")
    private List<DisplayFieldDTO> displayFields;

    /**
     * asSelf
     */
    @JsonAlias("as_self")
    private Integer asSelf;
}
