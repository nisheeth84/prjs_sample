/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author nguyentrunghieu
 */
@Data
@EqualsAndHashCode
public class InitializeManagerModalSubType3 implements Serializable {

    private static final long serialVersionUID = 2535393183655375399L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeSurname
     */
    private String employeeSurname;

    /**
     * employeeName
     */
    private String employeeName;

}
