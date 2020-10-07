/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for api createGroup
 * 
 * @author phamminhphu
 */
@Data
public class CreateGroupResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8506335013084881277L;

    private Long groupId;
}
