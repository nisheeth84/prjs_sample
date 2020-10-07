/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * @author phamminhphu
 *
 */
@Data
public class CreateDepartmentResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6961510145018344080L;

    private Long departmentId;
}
