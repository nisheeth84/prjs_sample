/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for api updateDepartment
 * 
 * @author phamminhphu
 */
@Data
public class UpdateDepartmentResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7856146681666917277L;

    private Long departmentId;
}
