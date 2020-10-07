package jp.co.softbrain.esales.commons.service.dto;
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
    
    private static final long serialVersionUID = -2319146152110006927L;
    
    @JsonAlias("field_name")
    private String fieldName;
    
    @JsonAlias("field_id")
    private Long fieldId;
    
    @JsonAlias("relation_id")
    private Long relationId;
    
    @JsonAlias("field_belong")
    private Long fieldBelong;
    
}
