/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for participantDepartment in API InitializeGroupModal
 * 
 * @author buithingocanh
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class ParticipantDepartmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * The departments departmentId
     */
    private Long departmentId;

    /**
     * The departments departmentName
     */
    private String departmentName;

    /**
     * The departments departmentParentName
     */
    private String parentDepartmentName;

    /**
     * employeesDepartment
     */
    private List<DepartmentsGroupsMembersDTO> employeesDepartments;

    /**
     * Constructor
     *
     * @param departmentId
     * @param departmentName
     * @param parentDepartmentName
     */
    public ParticipantDepartmentDTO(Long departmentId, String departmentName, String parentDepartmentName) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.parentDepartmentName = parentDepartmentName;
    }

}
