/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API delete group
 * 
 * @author phamminhphu
 */
@Data
public class DeleteGroupRequest implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2475073154643338610L;

    private Long groupId;
}
