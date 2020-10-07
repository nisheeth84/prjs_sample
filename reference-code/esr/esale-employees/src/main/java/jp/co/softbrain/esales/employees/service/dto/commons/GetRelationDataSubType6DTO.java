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
public class GetRelationDataSubType6DTO implements Serializable {
    
    private static final long serialVersionUID = 4818064223429462129L;
    
    private Long employeeId;
    
    private String photoFilePath;
    
    private String photoFileName;
    
    private String photoFileUrl;
    
    private String employeeName;
    
    private List<GetRelationDataSubType7DTO> departments;
    
    private String employeeSurname;
}
