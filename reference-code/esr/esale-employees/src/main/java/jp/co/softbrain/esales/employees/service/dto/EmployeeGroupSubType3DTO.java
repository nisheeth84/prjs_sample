package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The keyValue class to map data for EmployeesGroupIn
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class EmployeeGroupSubType3DTO implements Serializable {

    private static final long serialVersionUID = 8518466235992180666L;

    /**
     * employeeId
     */
    private Long employeeId;

}
