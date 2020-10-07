package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

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
public class DepartmentAndEmployeeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1276596685322806535L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * parentId
     */
    private Long parentId;

    /**
     * parentName
     */
    private String parentName;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
