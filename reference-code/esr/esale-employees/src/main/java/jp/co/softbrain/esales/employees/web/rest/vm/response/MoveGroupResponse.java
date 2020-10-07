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
public class MoveGroupResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1895657680409038060L;
    private List<Long> list;
}
