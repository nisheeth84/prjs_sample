package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Employees}
 * entity.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class SelectEmployeesDTO implements Serializable {

    private static final long serialVersionUID = -740459224997850209L;

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
     *  The Employees isAdmin
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
     *  The Employees formatDateId
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
     * The createdDate
     */
    private Instant createdDate;

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The updatedUser
     */
    private Long updatedUser;
}
