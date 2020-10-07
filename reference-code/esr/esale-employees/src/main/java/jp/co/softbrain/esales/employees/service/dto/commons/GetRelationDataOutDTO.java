package jp.co.softbrain.esales.employees.service.dto.commons;

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
public class GetRelationDataOutDTO implements Serializable {
    
    private static final long serialVersionUID = -7343995835382330117L;
    
    private List<GetRelationDataSubType1DTO> relationData;
    
    private List<GetRelationDataSubType5DTO> fieldItems;
    
    private List<GetRelationDataSubType6DTO> employee;
    
    private List<GetRelationDataSubType8DTO> departments;
    
    private List<GetRelationDataSubType10DTO> groups;
    
    private List<GetRelationDataSubType11DTO> employees;
}
