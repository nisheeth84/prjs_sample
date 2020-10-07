package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
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
