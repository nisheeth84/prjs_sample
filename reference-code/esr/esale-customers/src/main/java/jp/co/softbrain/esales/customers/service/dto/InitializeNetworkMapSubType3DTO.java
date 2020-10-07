/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author phamminhphu
 *
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8633423763196751310L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * employeeSurname
     */
    private String employeeSurname;

    /**
     * positionName
     */
    private String positionName;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeSurnameKana
     */
    private String employeeSurnameKana;

    /**
     * employeeNameKana
     */
    private String employeeNameKana;

    /**
     * telephoneNumber
     */
    private String telephoneNumber;

    /**
     * The Employees cellphoneNumber
     */
    private String cellphoneNumber;

    /**
     * email
     */
    private String email;

    /**
     * employeeImage
     */
    private InitializeNetworkMapSubType7DTO employeePhoto;

    /**
     * flagActivity
     */
    private Integer flagActivity;
}
