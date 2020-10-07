package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Out DTO for API getEmployeeSuggestionsGlobal
 * 
 * @author phamminhphu
 */
@Data
public class GetEmpSugGlobalOutDTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2415289009215384607L;

    /**
     * employeePhoto
     */
    private Long employeeId;

    /**
     * employeePhoto
     */
    private EmployeeIconDTO employeePhoto;

    /**
     * employeeDepartments
     */
    private List<DepartmentPositionDTO> employeeDepartments;
    
    /**
     * employeeSurname
     */
    private String employeeSurname;
    
    /**
     * employeeName
     */
    private String employeeName;

    /**
     * The Employees employeeFullName
     */
    private String employeeFullName;
}
