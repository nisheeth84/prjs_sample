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
public class GetRelationDataSubType1DTO implements Serializable {
    
    private static final long serialVersionUID = -3710143810751984656L;
    
    private Long recordId;
    
    private List<GetRelationDataSubType2DTO> dataInfos;
}
