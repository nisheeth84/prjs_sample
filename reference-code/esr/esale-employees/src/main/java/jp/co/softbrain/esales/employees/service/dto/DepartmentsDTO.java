package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Departments}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DepartmentsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 872224121861739604L;

    /**
     * The Departments departmentId
     */
    private Long departmentId;

    /**
     * The Departments departmentName
     */
    private String departmentName;

    /**
     * The Departments departmentOrder
     */
    private Integer departmentOrder;

    /**
     * The Departments parentId
     */
    private Long parentId;

    /**
     * The Departments managerId
     */
    private Long managerId;

    /**
     * department children
     */
    private List<DepartmentsDTO> departmentChild;
    /**
     * Update Date
     */
    private Instant updateDate;

    /**
     * manager
     */
    private DepartmentManagerDTO manager;
}
