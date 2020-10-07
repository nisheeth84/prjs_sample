package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2896626246330214509L;
    /**
     * The email
     */
    private String email;
    /**
     * The employee id
     */
    private Long employeeId;
    /**
     * The employee name
     */
    private String employeeName;

    /**
     * The employee name
     */
    private String employeeSurname;

    /**
     * The employee name
     */
    private Integer employeeStatus;

}
