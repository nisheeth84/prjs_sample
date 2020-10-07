package jp.co.softbrain.esales.employees.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
/**
 * Response for API GetEmployeeByTenantResponse
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class EmployeeDepartmentBasicDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6622950458724140641L;

    private String departmentName;
    private Long departmentId;
    private Integer departmentOrder;
    private Long positionId;
    private String positionName;
    private Integer positionOrder;

}
