package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;

/**
 * Update department view modal
 * 
 * @author phamminhphu
 */
@Data
public class UpdateDepartmentRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7252397190131704893L;
    private Long departmentId;
    private String departmentName;
    private Long managerId;
    private Long parentId;
    private Instant updatedDate;

}
