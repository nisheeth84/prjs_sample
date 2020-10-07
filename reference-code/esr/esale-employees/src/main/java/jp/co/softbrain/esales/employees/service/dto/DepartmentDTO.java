package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Departments}
 * entity.
 */
@Data
@EqualsAndHashCode
public class DepartmentDTO implements Serializable {


    private static final long serialVersionUID = 6374377281796796221L;

    /**
     * The Licenses licenseId
     */
    private Long departmentId;

    /**
     * The  Licenses licenseName
     */
    private String departmentName;

    /**
     * Update Date
     */
    private Instant updatedDate;
}
