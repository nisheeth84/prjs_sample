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
public class GetRelationDataSubType7DTO implements Serializable {
    
    private static final long serialVersionUID = -5769791920439371983L;
    
    private Long departmentId;
    
    private String departmentName;
    
    private Long positionId;
    
    private String positionName;

}
