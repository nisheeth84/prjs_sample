/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Initialize Department Modal
 * 
 * @author nguyentrunghieu
 */
@Data
@EqualsAndHashCode
public class InitializeDepartmentModalOutDTO implements Serializable {

    private static final long serialVersionUID = -8495442635880095478L;

    /**
     * department
     */
    private DepartmentsDTO department;

    /**
     * departments
     */
    private List<DepartmentsDTO> departments;
}
