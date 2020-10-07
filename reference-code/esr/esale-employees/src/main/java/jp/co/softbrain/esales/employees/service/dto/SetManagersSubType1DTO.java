/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author nguyentrunghieu
 */
@Data
@EqualsAndHashCode
public class SetManagersSubType1DTO implements Serializable {
    private static final long serialVersionUID = 7447551598969821137L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
