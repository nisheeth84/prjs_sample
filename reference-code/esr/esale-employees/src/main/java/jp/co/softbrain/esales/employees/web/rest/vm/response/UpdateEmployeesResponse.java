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
public class UpdateEmployeesResponse implements Serializable {
    /**
     * 
     * serialVersionUID
     */
    private static final long serialVersionUID = -3506691967115703710L;
    private List<Long> list;
}
