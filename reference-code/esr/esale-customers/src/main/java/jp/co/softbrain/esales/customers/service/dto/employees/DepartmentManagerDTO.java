package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The Department Manager DTO class
 * 
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class DepartmentManagerDTO implements Serializable {

    private static final long serialVersionUID = -7579125820582198129L;

    /**
     * The Departments departmentId
     */
    private Long departmentId;

    /**
     * The Departments departmentName
     */
    private String departmentName;

    /**
     * The Departments managerId
     */
    private Long managerId;

    /**
     * The manager surname of department
     */
    private String managerSurname;

    /**
     * The manager name of department
     */
    private String managerName;

}
