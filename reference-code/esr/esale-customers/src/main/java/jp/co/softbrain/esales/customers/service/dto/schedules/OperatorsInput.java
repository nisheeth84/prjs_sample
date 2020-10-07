package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * OperatorsInput
 * 
 * @author haodv
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class OperatorsInput implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2037903856964519812L;
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
}
