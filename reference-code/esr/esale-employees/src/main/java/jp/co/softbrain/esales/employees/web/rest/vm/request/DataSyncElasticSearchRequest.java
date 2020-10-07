/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * View modal for DataSyncElasticSearch
 * 
 * @author phamminhphu
 */
@Data
public class DataSyncElasticSearchRequest implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;
    private List<Long> employeeIds;
}
