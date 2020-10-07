package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetCustomersOutPersonInChargeDTO
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class PersonsInChargeDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2250217614139881157L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeePhoto
     */
    private String employeePhoto;

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

}
