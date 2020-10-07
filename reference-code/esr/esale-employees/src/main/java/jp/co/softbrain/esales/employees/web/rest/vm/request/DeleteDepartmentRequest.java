/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for delete department
 * 
 * @author phamminhphu
 */
@Data
public class DeleteDepartmentRequest implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1838908190080680832L;

    private Long departmentId;
}
