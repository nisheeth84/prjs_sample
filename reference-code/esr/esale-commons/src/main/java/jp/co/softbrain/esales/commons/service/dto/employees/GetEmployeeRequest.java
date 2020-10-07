package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API getEmployee
 * 
 * @author phamdongdong
 */
@Data
public class GetEmployeeRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230981095595566820L;
    private final Long employeeId;
    private final String mode;
}
