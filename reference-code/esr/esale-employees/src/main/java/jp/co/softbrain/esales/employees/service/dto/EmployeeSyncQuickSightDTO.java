package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import jp.co.softbrain.esales.employees.domain.Employees;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO for {@link Employees} using for synchronize quick-sight
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeSyncQuickSightDTO implements Serializable {

    private static final long serialVersionUID = -8837788748314979867L;

    private Long employeeId;

    private String employeeSurname;

    private String employeeName;

    private String email;

    private Integer employeeStatus;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isAccountQuicksight;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long packageId;

    @JsonIgnore
    private List<Long> summaryPackageId;

    private Integer action;

    /**
     * Constructor without fields: action, summaryPackageId
     *
     * @param employeeId employeeId
     * @param employeeSurname employeeSurname
     * @param employeeName employeeName
     * @param email email
     * @param employeeStatus employeeStatus
     * @param isAccountQuicksight isAccountQuicksight
     * @param packageId packageId
     */
    public EmployeeSyncQuickSightDTO(Long employeeId, String employeeSurname, String employeeName, String email,
            Integer employeeStatus, Boolean isAccountQuicksight, Long packageId) {
        this.employeeId = employeeId;
        this.employeeSurname = employeeSurname;
        this.employeeName = employeeName;
        this.email = email;
        this.employeeStatus = employeeStatus;
        this.isAccountQuicksight = isAccountQuicksight;
        this.packageId = packageId;
    }
}
