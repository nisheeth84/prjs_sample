package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO use to customize response fields getting from field_info_item entity
 */
@Data
@EqualsAndHashCode
public class RelationDataDTO implements Serializable{

    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = 378668573330314494L;

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
