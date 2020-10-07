/**
 *
 */
package jp.co.softbrain.esales.employees.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for the node data.employees of response from API getEmployees
 *
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesWithEmployeeDataFormatDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8194298553534373484L;

    /**
     * The Employees employeeId
     */
    private Long employeeId;

    /**
     * The Employees isBusy
     */
    private Boolean isBusy;

    /**
     * The Employees photoFileName
     */
    private String photoFileName;

    /**
     * The Employees photoFilePath
     */
    private String photoFilePath;

    /**
     * The  Employees fileUrl
     */
    private String photoFileUrl;

    /**
     * The Employees departments
     */
    private List<DepartmentPositionDTO> departments;

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
    private List<EmployeesDataDTO> employeeData = new ArrayList<>();

    /**
     * The Employees manager
     */
    private List<EmployeeNameDTO> employeeManagers;

    /**
     * The Employees staffMember
     */
    private List<EmployeeNameDTO> employeeSubordinates;

}
