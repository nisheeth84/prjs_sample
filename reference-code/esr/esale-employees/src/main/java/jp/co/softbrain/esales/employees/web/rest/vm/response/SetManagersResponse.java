/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @author dohuunam
 *
 */
@Data
public class SetManagersResponse implements Serializable {
    /**
     * 
     * serialVersionUID
     */
    private static final long serialVersionUID = 1009115540478527451L;
    private List<Long> list;
}
