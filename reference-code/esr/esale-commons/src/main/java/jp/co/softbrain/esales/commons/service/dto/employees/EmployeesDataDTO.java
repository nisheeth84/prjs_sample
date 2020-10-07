package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node employee data of response from getEmployees API
 * 
 * @author lehuuhoa
 */
@Data
@EqualsAndHashCode
public class EmployeesDataDTO implements Serializable {
    private static final long serialVersionUID = 2089499086764301995L;

    private Integer fieldType;

    private String key;

    private String value;
}
