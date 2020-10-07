/**
 *
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for API update auto group
 *
 * @author phamminhphu
 */
@Data
public class RefreshAutoGroupResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2652763054194325812L;

    private Long groupId;
}
