/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node employeeData of response from getEmployees API
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class EmployeesDataDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8910033868863958522L;

    private Integer fieldType;

    private String key;

    private String value;
}
