package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Out DTO sub type class for API getDepartments
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetDepartmentsOutSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3943562795221983682L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * parentDepartment
     */
    private DepartmentParentDTO parentDepartment;

    /**
     * employeeIds
     */
    private List<Long> employeeIds;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
