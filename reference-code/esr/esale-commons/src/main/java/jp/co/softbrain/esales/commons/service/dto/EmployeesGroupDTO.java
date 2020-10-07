package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.EmployeesGroups}
 * entity.
 */
@Data
@EqualsAndHashCode
public class EmployeesGroupDTO implements Serializable {

    private static final long serialVersionUID = -6172526131294545643L;

    /**
     * The EmployeesGroups groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroups groupName
     */
    private String groupName;
}
