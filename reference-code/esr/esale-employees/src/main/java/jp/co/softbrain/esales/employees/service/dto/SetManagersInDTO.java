/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request DTO for setManagers
 * 
 * @author nguyentrunghieu
 */
@Data
@EqualsAndHashCode
public class SetManagersInDTO implements Serializable {
    private static final long serialVersionUID = 7828922962451735184L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * managerId
     */
    private Long managerId;

    /**
     * employeeUpdates
     */
    private List<SetManagersSubType1DTO> employeeUpdates;
}
