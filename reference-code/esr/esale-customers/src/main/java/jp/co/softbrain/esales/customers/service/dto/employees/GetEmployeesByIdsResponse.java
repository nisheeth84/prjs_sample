package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetEmployeesByIdsResponse
 */
@Data
@EqualsAndHashCode
public class GetEmployeesByIdsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2522598774176406534L;

    /**
     * employees
     */
    private List<EmployeeInfoDTO> employees;
}
