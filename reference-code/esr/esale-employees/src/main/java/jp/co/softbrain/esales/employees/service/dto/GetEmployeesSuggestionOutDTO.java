package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO out of API getEmployeesSuggestion
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionOutDTO implements Serializable {

    private static final long serialVersionUID = 1048946513611268301L;

    /**
     * list departments
     */
    private List<GetEmployeesSuggestionSubType1> departments;

    /**
     * list employees
     */
    private List<EmployeeInfoDTO> employees;

    /**
     * list groups
     */
    private List<GetEmployeesSuggestionSubType5> groups;

    /**
     * total Employee
     */
    private Long total;

}
