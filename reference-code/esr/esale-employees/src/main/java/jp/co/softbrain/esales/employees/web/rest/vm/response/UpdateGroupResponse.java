/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for API updateGroup
 * 
 * @author phamminhphu
 */
@Data
public class UpdateGroupResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4341454915459507500L;

    private Long groupId;
}
