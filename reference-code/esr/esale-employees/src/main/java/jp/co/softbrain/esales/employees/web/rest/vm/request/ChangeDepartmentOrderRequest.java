/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO;
import lombok.Data;

/**
 * @author phamminhphu
 */
@Data
public class ChangeDepartmentOrderRequest implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230981095559568620L;
    
    private List<DepartmentsDTO> departmentParams;
}
