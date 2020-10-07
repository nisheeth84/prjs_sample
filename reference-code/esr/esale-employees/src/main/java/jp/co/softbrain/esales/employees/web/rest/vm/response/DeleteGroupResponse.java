/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for api delete group
 * 
 * @author phamminhphu
 */
@Data
public class DeleteGroupResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3280073373249862688L;

    private Long groupId;
}
