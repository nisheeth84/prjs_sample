/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Get Group and department request
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetGroupAndDepartmentByNameRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8501582962649291200L;

    private String searchValue;
    
    private Integer searchType;

    private Integer searchOption;
}
