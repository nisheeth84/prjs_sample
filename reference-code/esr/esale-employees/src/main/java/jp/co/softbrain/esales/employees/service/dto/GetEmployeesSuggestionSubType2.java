package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO data department of API getEmployeesSuggestion
 * 
 * @author buithingocanh
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionSubType2 implements Serializable {

    private static final long serialVersionUID = -4469151800109056725L;
    /**
     * department id
     */
    private Long departmentId;

    /**
     * department name
     */
    private String departmentName;

    /**
     * id of parentDepartment
     */
    private Long parentDepartmentId;

    /**
     * name of parentDepartment
     */
    private String parentDepartmentName;

    /**
     * employeeId
     */
    private Long employeeId;

}
