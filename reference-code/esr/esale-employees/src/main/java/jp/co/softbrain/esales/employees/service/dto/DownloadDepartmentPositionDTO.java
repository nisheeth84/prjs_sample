package jp.co.softbrain.esales.employees.service.dto;
import java.io.Serializable;
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
public class DownloadDepartmentPositionDTO implements Serializable {

    private static final long serialVersionUID = -4963798722479662312L;

    /**
     * The EmployeesDepartments departmentId
     */
    private Long targetId;

    /**
     * The EmployeesDepartments departmentId
     */
    private Long departmentId;

    /**
     * The EmployeesDepartments departmentName
     */
    private String departmentName = "";

    /**
     * The EmployeesDepartments positionId
     */
    private Long positionId;

    /**
     * The EmployeesDepartments positionName
     */
    private String positionName = "";

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
    private String employeeSurName = "";

    /**
     * The Employees employeeName
     */
    private String employeeName = "";

}
