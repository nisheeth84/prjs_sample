/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for API deleteDepartment
 * 
 * @author phamminhphu
 */
@Data
public class DeleteDepartmentResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7123556158612718181L;

    private Long departmentId;
}
