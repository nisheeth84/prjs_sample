package jp.co.softbrain.esales.employees.service.dto.sales;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeInfoSubType1DTO implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2902650154501870665L;

	/**
	 * employeeId
	 */
	private Long employeeId;

	/**
	 * employeeName
	 */
	private String employeeName;

	/**
	 * employeeSurname
	 */
	private String employeeSurname;

	/**
	 * photoFilePath
	 */
	private String photoFilePath;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * positionName
     */
    private String positionName;

    /**
     * employeeSurnameKana
     */
    private String employeeSurnameKana;

    /**
     * employeeNameKana
     */
    private String employeeNameKana;

    /**
     * cellphoneNumber
     */
    private String cellphoneNumber;

    /**
     * telephoneNumber
     */
    private String telephoneNumber;

    /**
     * email
     */
    private String email;

}
