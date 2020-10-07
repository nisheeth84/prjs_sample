package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import javax.persistence.Lob;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.EmployeesHistories} entity.
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeesHistoriesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -7655204732767941871L;

    /**
     * The EmployeesHistories employeeHistoryId
     */
    private Long employeeHistoryId;

    /**
     * The EmployeesHistories employeeId
     */
    private Long employeeId;

    /**
     * The EmployeesHistories contentChange
     */
    @Lob
    private String contentChange;

}
