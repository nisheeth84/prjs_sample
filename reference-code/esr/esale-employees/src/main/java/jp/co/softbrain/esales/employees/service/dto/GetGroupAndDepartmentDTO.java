package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetGroupAndDepartmentDTO
 *
 * @author lequyphuc
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetGroupAndDepartmentDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1460963295144510070L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * groupIds
     */
    private Long groupId;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
