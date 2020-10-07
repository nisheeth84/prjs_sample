package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * DTO employee need for API getSelectedOrganizationInfo
 * @author chungochai
 *
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class EmployeeSelectedOrganizationDTO implements Serializable{
    
    private static final long serialVersionUID = 6918265325130016060L;
    
    private Long employeeId;
    
    private String photoFilePath;
    
    private String photoFileName;
    
    private String employeeName;
    
    private Long departmentId;
    
    private String departmentName;
    
    private Integer departmentOrder;
    
    private Long positionId;
    
    private String positionName;
    
    private Integer positionOrder;
    
    private String employeeSurname;

}