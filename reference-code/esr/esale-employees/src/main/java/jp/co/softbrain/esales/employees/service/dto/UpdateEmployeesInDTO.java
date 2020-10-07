package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Employee inDTO for update
 *
 * @author lediepoanh
 *
 */
@Data
@EqualsAndHashCode
public class UpdateEmployeesInDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3316164727347300572L;

    /**
     * employeeId
     */
    private Long employeeId;
    
    /**
     * employeeIcon
     */
    private String employeeIcon;

    /**
     * employee Surname
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

    /**
     * The Employees email
     */
    private String email;

    /**
     * The Employees telephoneNumber
     */
    private String telephoneNumber;

    /**
     * The Employees cellphoneNumber
     */
    private String cellphoneNumber;

    /**
     * user_id
     */
    private String userId;

    /**
     * The Employees languageId
     */
    private Long languageId;

    /**
     * The Employees timezoneId
     */
    private Long timezoneId;

    /**
     * formatDateId
     */
    private Integer formatDateId;

    /**
     * employee_data
     */
    private List<EmployeeDataType> employeeData;

    /**
     * departmentIds
     */
    private List<DepartmentPositionIdsDTO> departmentIds;
    
    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * packagesId
     */
    private List<Long> packagesId;

}
