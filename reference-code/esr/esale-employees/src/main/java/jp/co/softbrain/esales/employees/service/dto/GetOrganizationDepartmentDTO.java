package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for GetOrganization
 *
 * @author Trungnd
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetOrganizationDepartmentDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 842596638227781234L;

    /**
     * The departmentId
     */
    private Long departmentId;

    /**
     * The departmentName
     */
    private String departmentName;

}
