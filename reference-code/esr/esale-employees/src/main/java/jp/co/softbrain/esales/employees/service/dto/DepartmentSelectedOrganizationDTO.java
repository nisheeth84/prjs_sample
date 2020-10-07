package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO need for API getSelectedOrganizationInfo
 * @author chungochai
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class DepartmentSelectedOrganizationDTO implements Serializable{
    private static final long serialVersionUID = -6805534207412141816L;
    
    private Long departmentId;
    
    private String departmentName;
    
    private Long parentDepartmentId;
    
    private String parentDepartmentName;
    
    private Long employeeId;
    

}
