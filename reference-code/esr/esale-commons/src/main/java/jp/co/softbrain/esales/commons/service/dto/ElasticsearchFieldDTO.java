package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * A DTO for update column in elasticsearch
 */
@AllArgsConstructor
@Data
public class ElasticsearchFieldDTO implements Serializable {

    private static final long serialVersionUID = -1699283991273215897L;

    /**
     * The fieldId
     */
    private Long fieldId;
    
    /**
     * The fieldType
     */
    private Integer fieldType;

    /**
     * The fieldName
     */
    private String fieldName;
}
