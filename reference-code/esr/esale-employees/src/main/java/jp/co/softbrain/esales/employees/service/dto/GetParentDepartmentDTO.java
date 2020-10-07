package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Out DTO class for API getParentDepartment
 * 
 * @author phamminhphu
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class GetParentDepartmentDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3357426269066998155L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * pathTreeName
     */
    private String pathTreeName;

    /**
     * pathTreeId
     */
    private String pathTreeId;
}
