package jp.co.softbrain.esales.employees.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Response for API GetEmployeeByTenantResponse
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeBasicDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6622950458724140641L;

    private String employeeSurname;
    private String employeeName;
    private String employeeSurnameKana;
    private String employeeNameKana;
    private String email;
    private String telephoneNumber;
    private String cellphoneNumber;
    private Long departmentId;
    private String departmentName;
    private Integer departmentOrder;
    private Long positionId;
    private String positionName;
    private Integer positionOrder;
}
