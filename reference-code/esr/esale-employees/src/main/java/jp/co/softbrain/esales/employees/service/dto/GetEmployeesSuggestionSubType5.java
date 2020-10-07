package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for information group
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionSubType5 implements Serializable {

    private static final long serialVersionUID = 4377397996977530298L;
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
     * List employees of group
     */
    private List<EmployeesWithEmployeeDataFormatDTO> employeesGroups;

    /**
     * idHistoryChoice
     */
    private Long idHistoryChoice;
}
