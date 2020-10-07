package jp.co.softbrain.esales.uaa.service.dto.commons;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO information needs for Relation
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class DisplayFieldDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7667444154980993966L;

    @JsonAlias("field_name")
    private String fieldName;
    
    @JsonAlias("field_id")
    private Long fieldId;
    
    @JsonAlias("relation_id")
    private Long relationId;
    
    @JsonAlias("field_belong")
    private Long fieldBelong;
    
}
