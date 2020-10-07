package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO describe parentDepartment of API getEmployeesSuggestion
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionSubType3 implements Serializable {

    private static final long serialVersionUID = -7905678802124613688L;

    /**
     * departmentId
     */

    private Long departmentId;
    /**
     * departmentName
     */
    private String departmentName;

}
