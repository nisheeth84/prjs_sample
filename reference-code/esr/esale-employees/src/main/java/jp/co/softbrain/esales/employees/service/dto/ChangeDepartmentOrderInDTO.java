package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO object conditions of API changeDepartmentOrder
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ChangeDepartmentOrderInDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3263676829030641097L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * parentId
     */
    private Long parentId;

    /**
     * departmentOrder
     */
    private Long departmentOrder;
}
