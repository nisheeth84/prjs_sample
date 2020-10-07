/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request for API GetInitializeManagerModal
 * @author phamdongdong
 *
 */
@Data
public class GetInitializeManagerModalRequest implements Serializable{
    /**
     * 
     */
    private static final long serialVersionUID = 2239981095595566820L;
    private List<Long> employeeIds;
}
