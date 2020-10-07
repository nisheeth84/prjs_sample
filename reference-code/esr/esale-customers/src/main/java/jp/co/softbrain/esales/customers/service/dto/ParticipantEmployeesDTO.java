/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeIconDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for participantEmployees in API InitializeGroupModal
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class ParticipantEmployeesDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    /**
     * The Employees employeeId
     */
    private Long employeeId;
    /**
     * The Employees employeeSurname
     */
    private String employeeSurname;
    /**
     * The Employees employeeName
     */
    private String employeeName;
    /**
     * The Departments departmentName
     */
    private String departmentName;
    /**
     * employee Icon
     */
    private EmployeeIconDTO employeeIcon;
    
    /**
     * positionId
     */
    private Long positionId;
    
    /**
     * positionName
     */
    private String positionName;
    

}
