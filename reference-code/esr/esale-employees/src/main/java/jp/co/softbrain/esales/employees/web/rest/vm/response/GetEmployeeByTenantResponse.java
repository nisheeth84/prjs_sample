package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import jp.co.softbrain.esales.employees.service.dto.EmployeeOutDTO;
import lombok.Data;

/**
 * Response for API GetEmployeeByTenantResponse
 *
 * @author caotrandinhhuynh
 */

@Data
public class GetEmployeeByTenantResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6611950458724140641L;
    /**
     * The list employee
     */
    private EmployeeOutDTO data;

}
