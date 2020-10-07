package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Out DTO sub type class for API getDepartments
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class DepartmentParentDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5885431841912863034L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

}
