/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Response for API ChangeDepartmentOrder
 * 
 * @author phamminhphu
 */
@Data
public class ChangeDepartmentOrderResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2839275156390715709L;
    private List<Long> departmentIds;
}
