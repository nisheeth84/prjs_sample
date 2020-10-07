package jp.co.softbrain.esales.employees.web.rest.vm.response;

import jp.co.softbrain.esales.employees.service.dto.EmployeeDepartmentBasicDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Response for API GetEmployeeByTenantResponse
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetEmployeeBasicResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -661195045872140641L;

    private String employeeSurname;
    private String employeeName;
    private String employeeSurnameKana;
    private String employeeNameKana;
    private String email;
    private String telephoneNumber;
    private String cellphoneNumber;
    private List<EmployeeDepartmentBasicDTO> employeeDepartments;

}
