package jp.co.softbrain.esales.customers.service.dto.employees;
import java.io.Serializable;

import jp.co.softbrain.esales.utils.StringUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The Department Position DTO class
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class DepartmentPositionDTO implements Serializable {

    private static final long serialVersionUID = -6645151667368254794L;

    /**
     * contructor
     * 
     * @param departmentId departmentId
     * @param departmentName departmentName
     * @param positionId positionId
     * @param positionName positionName
     */
    public DepartmentPositionDTO(Long departmentId, String departmentName, Long positionId, String positionName) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
    }

    /**
     * constructor for method findDepartmentOfEmployeeId
     * 
     * @param departmentId departmentId
     * @param departmentName departmentName
     * @param positionId positionId
     * @param positionName positionName
     * @param positionOrder positionOrder
     * @param managerId managerId
     */
    public DepartmentPositionDTO(Long departmentId, String departmentName, Long positionId, String positionName,
            Integer positionOrder, Long managerId) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
        this.positionOrder = positionOrder;
        this.managerId = managerId;
    }

    /**
     * Constructor
     * 
     * @param departmentId departmentId
     * @param departmentName departmentName
     * @param positionId positionId
     * @param positionName positionName
     * @param employeeId employeeId
     * @param employeeSurName employeeSurName
     * @param employeeName employeeName
     */
    public DepartmentPositionDTO(Long departmentId, String departmentName, Long positionId, String positionName,
            Long employeeId, String employeeSurName, String employeeName) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
        this.employeeId = employeeId;
        this.employeeSurName = employeeSurName;
        this.employeeName = employeeName;
        this.employeeFullName = StringUtil.getFullName(employeeSurName, employeeName);
    }

    /**
     * The EmployeesDepartments departmentId
     */
    private Long departmentId;

    /**
     * The EmployeesDepartments departmentName
     */
    private String departmentName;

    /**
     * The EmployeesDepartments positionId
     */
    private Long positionId;

    /**
     * The EmployeesDepartments positionName
     */
    private String positionName;

    /**
     * positionOrder
     */
    private Integer positionOrder;

    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * The Employees employeeSurName
     */
    private String employeeSurName;

    /**
     * The Employees employeeName
     */
    private String employeeName;

    /**
     * The Employees employeeFullName
     */
    private String employeeFullName;

    /**
     * pathTreeName
     */
    private String pathTreeName;

    /**
     * The employeeId
     */
    private Long managerId;

}
