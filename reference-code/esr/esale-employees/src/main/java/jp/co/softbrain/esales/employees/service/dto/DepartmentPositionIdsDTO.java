package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DepartmentIdsDateType for createUpdate
 *
 * @author HaiCN
 *
 */
@Data
@EqualsAndHashCode
public class DepartmentPositionIdsDTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4504912616268671415L;
    
    /**
     * department_id in employees_departments
     */
    private Long departmentId;
    
    /**
     * position_id in employees_departments
     */
    private Integer positionId;
    
    /**
     * manager_id in employees_departments
     */
    private Long managerId;
    
}
