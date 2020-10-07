package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request for API getEmployeeIds
 * 
 * @author VietNQ
 */
@Data
public class GetEmployeeIdsRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2695964217557029753L;

    /**
     * employeeNames
     */
    private List<String> employeeNames;
}