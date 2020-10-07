package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for InitializeLocalMenu
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class InitializeLocalMenuOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4288761321999695819L;

    /**
     * departments
     */
    private List<DepartmentsDTO> departments;

    /**
     * myGroups
     */
    private List<EmployeesGroupsDTO> myGroups;

    /**
     * sharedGroups
     */
    private List<InitializeLocalMenuSubType1DTO> sharedGroups;
}
