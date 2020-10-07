/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.employees;

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
