/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Response for API  leaveGroup
 * 
 * @author phamminhphu
 */
@Data
public class LeaveGroupResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 227254491833517214L;
    private List<Long> employeeIds;
}
