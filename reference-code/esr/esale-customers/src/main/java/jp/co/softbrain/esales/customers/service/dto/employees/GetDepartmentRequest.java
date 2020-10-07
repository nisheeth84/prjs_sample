package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * View modal for api getDepartment
 * 
 * @author phamminhphu
 */
@Data
public class GetDepartmentRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 604481906277810211L;
    private List<Long> departmentIds;
    private Boolean getEmployeesFlg;
    private Long employeeId;

}
