package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.EmployeesGroups}
 * entity.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class EmployeesGroupNameDTO implements Serializable {

    private static final long serialVersionUID = -1619961050649430374L;

    /**
     * The EmployeesGroups groupId
     */
    private Long groupId;

    /**
     * The EmployeesGroups groupName
     */
    private String groupName;
}
