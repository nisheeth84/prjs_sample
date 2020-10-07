package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Out DTO class for API getDepartments
 */
@Data
@EqualsAndHashCode
public class GetDepartmentsOutDTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1619457562605014976L;

    /**
     * departments
     */
    private List<GetDepartmentsOutSubType1DTO> departments;

    /**
     * employees
     */
    private List<EmployeesWithEmployeeDataFormatDTO> employees;

}
