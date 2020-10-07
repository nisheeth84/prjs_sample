/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * LeaveGroup view modal
 * 
 * @author phamminhphu
 */
@Data
public class LeaveGroupRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6901487913772951411L;

    private Long groupId;
    private List<Long> employeeIds;
}
