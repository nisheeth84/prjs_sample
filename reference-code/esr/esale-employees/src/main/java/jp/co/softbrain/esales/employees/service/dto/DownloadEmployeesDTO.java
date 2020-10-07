package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Employees}
 * entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DownloadEmployeesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 5072600241279391898L;
    /**
     * The Employees employeeId
     */
    private Long employeeId;

    /**
     * The Employees photoFileName
     */
    private String photoFileName;

    /**
     * The Employees photoFilePath
     */
    private String photoFilePath;

    /**
     * The Employees departments
     */
    private List<DownloadDepartmentPositionDTO> departments;

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
     * The Employees userId
     */
    private String userId;

    /**
     * isAdmin
     */
    private Boolean isAdmin;

    /**
     * The Employees languageId
     */
    private Long languageId;

    /**
     * The Employees timezoneId
     */
    private Long timezoneId;

    /**
     * The Employees formatDateId
     */
    private Integer formatDateId;

    /**
     * The Employees employeeStatus
     */
    private Integer employeeStatus;

    /**
     * The Employees employeeData
     */
    private String employeeData;

    /**
     * The Employees manager
     */
    private List<DownloadEmployeeNameDTO> employeeManagers ;

    /**
     * The Employees staffMember
     */
    private List<DownloadEmployeeNameDTO> employeeSubordinates ;

    /**
     * isDisplayFirstScreen
     */
    private Boolean isDisplayFirstScreen;
}
