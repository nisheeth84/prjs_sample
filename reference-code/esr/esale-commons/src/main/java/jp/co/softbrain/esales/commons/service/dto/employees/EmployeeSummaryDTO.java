package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for node data.employeeManagers and data.employeeSubordinates in response
 * from API getEmployee
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor()
@NoArgsConstructor
public class EmployeeSummaryDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6142431568973449981L;

    /**
     * コンストラクタ
     * 
     * @param employeeIconPath
     * @param employeeId
     * @param employeeName
     * @param managerId
     * @param departmentName
     */
    public EmployeeSummaryDTO(String employeeIconPath, Long employeeId, String employeeName, Long managerId,
            String departmentName) {
        this.employeeIconPath = employeeIconPath;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.managerId = managerId;
        this.departmentName = departmentName;
    }

    private FileInfosDTO employeeIcon;

    private String employeeIconPath;

    private Long employeeId;

    private String employeeName;

    private Long managerId;

    private String departmentName;
}
