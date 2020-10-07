/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Response for API add group
 * 
 * @author phamminhphu
 */
@Data
public class AddGroupResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2270106694248220173L;
    private List<Long> listGroup;
}
