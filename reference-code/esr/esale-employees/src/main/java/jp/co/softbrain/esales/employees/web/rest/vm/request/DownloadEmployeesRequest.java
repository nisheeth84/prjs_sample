/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;

/**
 * @author phamminhphu
 */
@Data
public class DownloadEmployeesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2819898068292804760L;

    private List<Long> employeeIds;
    private List<KeyValue> orderBy;
    private Integer selectedTargetType;
    private Long selectedTargetId;

}
