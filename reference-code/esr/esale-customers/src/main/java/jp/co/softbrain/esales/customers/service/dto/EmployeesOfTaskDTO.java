package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * EmployeesOfTaskDTO
 */
@Data
@EqualsAndHashCode
public class EmployeesOfTaskDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2463439064480319153L;

    private Long employeeId;

    private String employeeName;

    private String photoFilePath;

    private String fileUrl;

    /* employee information start */
    private String cellphoneNumber;

    private String email;

    private String employeeSurname;

    private String employeeSurnameKana;

    private String employeeNameKana;

    private String telephoneNumber;

    private String departmentName;

    private String positionName;
    /* employee information end */
}
