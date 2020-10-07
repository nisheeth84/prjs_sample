package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API GetGroupAndDepartmentByEmployeeIds
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetGroupAndDepartmentByEmployeeIdsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5928405167137282790L;

    /**
     * employees
     */
    private List<GetGroupAndDepartmentByEmployeeIdsSubType1DTO> employees;
}
