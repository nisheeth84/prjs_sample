package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Employees}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeeInfoDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -6650147833769001167L;

    /**
     * The Employees employeeId
     */
    private Long employeeId;

    private EmployeeIconDTO employeeIcon;

    /**
     * The Employees employeeDepartments
     */
    private List<DepartmentPositionDTO> employeeDepartments = new ArrayList<>();

    /**
     * The Employees employeeGroups
     */
    private List<EmployeesGroupNameDTO> employeeGroups = new ArrayList<>();

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
     * The Employees staffMember
     */
    private List<EmployeeFullNameDTO> employeeSubordinates = new ArrayList<>();

    /**
     * The Employees userId
     */
    private String userId;

    /**
     * isAdmin
     */
    private Boolean isAdmin;

    /**
     * The Employees language
     */
    private LanguagesDTO language;

    /**
     * The Employees timezone
     */
    private TimezonesDTO timezone;

    /**
     * The Employees employeeStatus
     */
    private Integer employeeStatus;

    /**
     * The Employees employeeData
     */
    private List<EmployeesDataDTO> employeeData = new ArrayList<>();

    /**
     * The Employees isBusy
     */
    private Boolean isBusy;

    /**
     * idHistoryChoice
     */
    private Long idHistoryChoice;

    /**
     * employeePackages
     */
    private List<EmployeesPackagesSubtypeDTO> employeePackages = new ArrayList<>();

    /**
     * isDisplayFirstScreen
     */
    private Boolean isDisplayFirstScreen;

    /**
     * The flag account quick sight
     */
    private Boolean isAccountQuicksight;

    /**
     * timezoneId
     */
    private Long timezoneId;
}
