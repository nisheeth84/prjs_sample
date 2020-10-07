/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Move to department view modal
 * 
 * @author phamminhphu
 */
@Data
public class MoveToDepartmentRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8552413029565767993L;

    private Long departmentId;
    private List<Long> employeeIds;
    private Integer moveType;

}
