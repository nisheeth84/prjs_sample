package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DepartmentsOfTaskDTO
 */
@Data
@EqualsAndHashCode
public class DepartmentsOfTaskDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3726093126133846770L;

    private Long departmentId;

    private String departmentName;

}
