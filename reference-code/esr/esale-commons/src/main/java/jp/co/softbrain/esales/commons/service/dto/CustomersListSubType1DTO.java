/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * List inDTO for createList, updateList
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class CustomersListSubType1DTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1139092109175289918L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * participantType
     */
    private Integer participantType;
}
