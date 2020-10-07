package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeNameDTO;
import lombok.Data;

/**
 * Response for API getEmployeeIds
 * 
 * @author VietNQ
 */
@Data
public class GetEmployeeIdsResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6844349180503430616L;

    /**
     * employees
     */
    private List<EmployeeNameDTO> employees;
}
