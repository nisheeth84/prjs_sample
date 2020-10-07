package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for node employeeData of response from getEmployees API
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EmployeesDataDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8910033868863958522L;

    private Integer fieldType;

    private String key;

    private String value;
}
