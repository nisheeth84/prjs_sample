package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksOutEmployeeDTO
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class GetTasksOutEmployeeDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -6168980260074135900L;

    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * The employeeName
     */
    private String employeeName;

    /**
     * The departmentName
     */
    private String departmentName;

    /**
     * The positionName
     */
    private String positionName;

    /**
     * The photoFilePath
     */
    private String photoFilePath;

    /**
     * The employeeNameKana
     */
    private String employeeNameKana;

    /**
     * The flagActivity
     */
    private String flagActivity;

    /**
     * The telephoneNumber
     */
    private String cellphoneNumber;
    
    /**
     * The cellphoneNumber
     */
    private String telephoneNumber;

    /**
     * The email
     */
    private String email;

    /**
     * The employee surname
     */
    private String employeeSurname;

    /**
     * The employeeNameKana
     */
    private String employeeSurnameKana;
}
