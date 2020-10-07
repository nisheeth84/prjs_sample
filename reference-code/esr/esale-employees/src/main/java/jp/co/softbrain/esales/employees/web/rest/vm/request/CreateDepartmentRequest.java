package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Create department view modal
 * 
 * @author phamminhphu
 */
@Data
public class CreateDepartmentRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7855739296448037593L;
    private String departmentName;
    private Long managerId;
    private Long parentId;

}
