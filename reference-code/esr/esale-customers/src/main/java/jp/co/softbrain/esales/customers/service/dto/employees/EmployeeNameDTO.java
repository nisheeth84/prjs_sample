package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class EmployeeNameDTO implements Serializable {

    private static final long serialVersionUID = -6457010285373276059L;
    /**
     * The employeeId
     */
    private Long employeeId;
    /**
     * The employee name
     */
    private String employeeName;
}
