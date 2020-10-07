/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for information group from DB
 * 
 * @author buithingocanh
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionSubType4 implements Serializable {

    private static final long serialVersionUID = -7905678802124613688L;
    
    /**
     * The EmployeesGroups groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroups groupName
     */
    private String groupName;
    /**
     * The EmployeesGroups isAutoGroup
     */
    private Boolean isAutoGroup;
    
    /**
     * The EmployeesGroupsParticipant employeeId
     */
    private Long employeeId;

}
