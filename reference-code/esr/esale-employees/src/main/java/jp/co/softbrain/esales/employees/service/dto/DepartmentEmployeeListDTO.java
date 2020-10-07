package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
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
public class DepartmentEmployeeListDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3007105360644616159L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * list employee full name
     */
    private String listEmployeeFullName;
}
