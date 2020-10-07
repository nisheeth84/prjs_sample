package jp.co.softbrain.esales.employees.service.dto.commons;
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
    private static final long serialVersionUID = -3108457714859370219L;

    @JsonAlias("field_name")
    private String fieldName;
    
    @JsonAlias("field_id")
    private Long fieldId;
    
    @JsonAlias("relation_id")
    private Long relationId;
    
    @JsonAlias("field_belong")
    private Long fieldBelong;
    
}
