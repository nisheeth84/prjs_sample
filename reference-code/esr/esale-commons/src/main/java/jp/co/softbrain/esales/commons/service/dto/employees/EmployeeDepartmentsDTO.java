package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for node data.employeeDepartments of data from API getEmployee
 * 
 * @author nguyentienquan
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class EmployeeDepartmentsDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2975467045184674638L;

    /**
     * department id
     */
    private Long departmentId;

    /**
     * department name
     */
    private String departmentName;

    /**
     * The EmployeesDepartments departmentOrder
     */
    private Integer departmentOrder;

    /**
     * positionId
     */
    private Long positionId;

    /**
     * positionName
     */
    private String positionName;

    /**
     * positionOrder
     */
    private Integer positionOrder;
}
