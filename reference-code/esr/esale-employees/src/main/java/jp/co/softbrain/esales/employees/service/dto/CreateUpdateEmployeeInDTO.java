package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * Employee inDTO for createUpdate
 * @author HaiCN
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CreateUpdateEmployeeInDTO implements Serializable{
 	/**
     * serialVersionUID
     */
    private static final long serialVersionUID = -19949150690141560L;


    /**
     * employeeIcon
     */
    private String employeeIcon;

    /**
     * photoFileName
     */
    private String photoFileName;

    /**
     * photoFileName
     */
    private String photoFilePath;

    /**
     * employeeSurname
     */
    private String employeeSurname;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeSurnameKana
     */
    private String employeeSurnameKana;

    /**
     * employeeSurnameKana
     */
    private String employeeNameKana;

    /**
     * email
     */
    private String email;

    /**
     * telephoneNumber
     */
    private String telephoneNumber;

    /**
     * telephoneNumber
     */
    private String cellphoneNumber;

    /**
     * userId
     */
    private String userId;

    /**
     * languageId
     */
    private Long languageId;

    /**
     * timezoneId
     */
    private Long timezoneId;

    /**
     * updateDate
     */
    private Instant updatedDate;

    /**
     * employeeData
     */
    private List<EmployeeDataType> employeeData;

    /**
     * departmentIds
     */
    private List<DepartmentPositionIdsDTO> employeeDepartments;

    /**
     * packageIds
     */
    private List<Long> packageIds;

    /**
     * employee_status
     */
    private Integer employeeStatus;

    /**
     * isAdmin
     */
    private Boolean isAdmin;

    /**
     * formatDateId
     */
    private Integer formatDateId;

    /**
     * isAccessContractSite
     */
    private Boolean isAccessContractSite;

    /**
     * comment
     */
    private String comment;

    /**
     * isSendMail
     */
    private Boolean isSendMail;
}
