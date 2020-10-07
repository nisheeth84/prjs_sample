/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Get Department by name DTO
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetDepartmentByNameDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4317714021548653783L;

    private Long departmentId;
    private String departmentName;
}
