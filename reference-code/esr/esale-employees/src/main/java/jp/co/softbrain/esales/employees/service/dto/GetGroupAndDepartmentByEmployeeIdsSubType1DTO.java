package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API GetGroupAndDepartmentByEmployeeIds
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetGroupAndDepartmentByEmployeeIdsSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * departmentIds
     */
    private List<Long> departmentIds;

    /**
     * groupIds
     */
    private List<Long> groupIds;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
