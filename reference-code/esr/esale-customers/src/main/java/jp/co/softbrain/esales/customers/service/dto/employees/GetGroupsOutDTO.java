package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API getGroups
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetGroupsOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1562634654363464L;

    /**
     * groups
     */
    private List<GetGroupsSubType1DTO> groups;

    /**
     * employees
     */
    private List<EmployeesWithEmployeeDataFormatDTO> employees;
}
