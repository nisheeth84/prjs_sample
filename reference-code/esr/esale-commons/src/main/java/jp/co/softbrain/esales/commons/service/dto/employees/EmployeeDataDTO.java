package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node "data" of Json respnse from API getEmployee
 */
@Data
@EqualsAndHashCode
public class EmployeeDataDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2737554563203430913L;

    /**
     * The Employees photo
     */
    private FileInfosDTO employeeIcon;

    /**
     * employeeDepartments
     */
    private List<EmployeeDepartmentsDTO> employeeDepartments = new ArrayList<>();

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
     * Employees Managers
     */
    private List<EmployeeSummaryDTO> employeeManagers = new ArrayList<>();

    /**
     * employeeSubordinates
     */
    private List<EmployeeSubordinatesDTO> employeeSubordinates = new ArrayList<>();

    /**
     * employeesSubscriptions
     */
    private List<EmployeesSubscriptionsSubtypeDTO> employeesSubscriptions = new ArrayList<>();

    /**
     * The Employees userId
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
     * The Employees employeeStatus
     */
    private Integer employeeStatus;

    /**
     * The Employees employeeData
     */
    private List<EmployeeDataType> employeeData = new ArrayList<>();

    /**
     * The Employees UpdateDate
     */
    private Instant updatedDate;

}
