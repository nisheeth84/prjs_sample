/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * @author phamminhphu
 */
@Data
public class GetEmployeeHistoryRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1888293931009894864L;

    private Long employeeId;
    private Integer currentPage;
    private Integer limit;

}
