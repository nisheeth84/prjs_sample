package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class out DTO sub type for API getScenario - employees
 */
@Data
@EqualsAndHashCode
public class GetScenarioOutSubTypeEmployeesDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5656176483633226522L;

    private Integer operatorDivision;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * photoEmployeeImg
     */
    private String employeeImage;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * groupName
     */
    private String groupName;

    /* employee information start */
    private String cellphoneNumber;

    private String email;

    private String employeeSurname;

    private String employeeSurnameKana;

    private String employeeNameKana;

    private String telephoneNumber;

    private String departmentOfEmployee;

    private String positionName;
    /* employee information end */

}
