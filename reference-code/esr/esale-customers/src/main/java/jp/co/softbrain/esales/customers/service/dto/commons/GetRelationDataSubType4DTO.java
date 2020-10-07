package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO need for response of API GetRelationDatas
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class GetRelationDataSubType4DTO implements Serializable {

    private static final long serialVersionUID = 5052615896623025986L;

    private Long fieldId;

    private String fieldName;

    private Integer fieldType;

    private String value;
}
