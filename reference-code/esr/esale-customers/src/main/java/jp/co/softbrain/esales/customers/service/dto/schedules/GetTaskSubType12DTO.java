package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.employees.EmployeesWithEmployeeDataFormatDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * TaskDepartmentsDetailOutput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
public class GetTaskSubType12DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8053180403189551088L;
    /**
     * departmentId
     */
    private Long departmentId;
    /**
     * departmentName
     */
    private String departmentName;
    /**
     * departmentParentName
     */
    private String departmentParentName;

    /**
     * photoDepartmentImg
     */
    private String photoDepartmentImg;

    /**
     * employees
     */
    private List<EmployeesWithEmployeeDataFormatDTO> employees;

}
