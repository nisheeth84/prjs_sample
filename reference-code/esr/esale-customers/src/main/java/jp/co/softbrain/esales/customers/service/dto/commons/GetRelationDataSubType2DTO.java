package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO need for response of API GetRelationDatas
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode
public class GetRelationDataSubType2DTO implements Serializable {
    
    private static final long serialVersionUID = -7120043914114193468L;
    
    private Long fieldId;
    
    private String fieldName;
    
    private Integer fieldType;
    
    private String value;
    
    private List<GetRelationDataSubType3DTO> childrenRelationDatas;

}
