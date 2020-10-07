package jp.co.softbrain.esales.employees.service.dto;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
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
     * @param employeeFullName employeeFullName
     */
    public DepartmentPositionDTO(Long departmentId, String departmentName, Long positionId, String positionName,
            Long employeeId, String employeeSurName, String employeeName, String employeeFullName) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
        this.employeeId = employeeId;
        this.employeeSurName = employeeSurName;
        this.employeeName = employeeName;
        this.employeeFullName = employeeFullName;
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
     * @param departmentId
     * @param departmentName
     * @param positionId
     * @param positionName
     * @param employeeId
     * @param employeeSurName
     * @param employeeName
     * @param employeeFullName
     * @param pathTreeName
     */
    public DepartmentPositionDTO(Long departmentId, String departmentName, Long positionId, String positionName,
            Long employeeId, String employeeSurName, String employeeName, String employeeFullName,
            String pathTreeName) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
        this.employeeId = employeeId;
        this.employeeSurName = employeeSurName;
        this.employeeName = employeeName;
        this.employeeFullName = employeeFullName;
        this.pathTreeName = pathTreeName;
    }

    /**
     * @param departmentId
     * @param departmentName
     * @param positionId
     * @param positionName
     * @param positionOrder
     * @param employeeId
     * @param employeeSurName
     * @param employeeName
     */
    public DepartmentPositionDTO(Long departmentId, String departmentName, Long positionId, String positionName,
        Integer positionOrder, Long employeeId, String employeeSurName, String employeeName) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
        this.positionOrder = positionOrder;
        this.employeeId = employeeId;
        this.employeeSurName = employeeSurName;
        this.employeeName = employeeName;
    }

    public DepartmentPositionDTO(Long departmentId, String departmentName, Long positionId, String positionName,
        Integer positionOrder, Long employeeId, String employeeSurName, String employeeName, Long managerId,
        String photoFileUrl) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
        this.positionOrder = positionOrder;
        this.employeeId = employeeId;
        this.employeeSurName = employeeSurName;
        this.employeeName = employeeName;
        this.managerId = managerId;
        this.photoFileUrl = photoFileUrl;
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

    /**
     * The employeeId
     */
    private String photoFileUrl;

}
