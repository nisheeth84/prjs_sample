package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO data department of API getEmployeesSuggestion
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionSubType1 implements Serializable {

    private static final long serialVersionUID = 6668282290966400724L;

    /**
     * departmentId
     */

    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * parent department
     */
    private GetEmployeesSuggestionSubType3 parentDepartment;

    /**
     * List employees of department
     */
    private List<EmployeesWithEmployeeDataFormatDTO> employeesDepartments;

    /**
     * idHistoryChoice
     */
    private Long idHistoryChoice;
}
