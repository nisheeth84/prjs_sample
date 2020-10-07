package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class EmployeeFullNameDTO implements Serializable {

    private static final long serialVersionUID = 1867029496840491878L;
    
    /**
     * The employeeId
     */
    private Long employeeId;
    /**
     * The employee name
     */
    private String employeeFullName;

    /**
     * The Employees employeeSurname
     */
    private String employeeSurname;

    /**
     * The Employees employeeName
     */
    private String employeeName;

    /**
     * The Employees employeeSurnameKana
     */
    private String employeeSurnameKana;

    /**
     * The Employees employeeNameKana
     */
    private String employeeNameKana;
}
