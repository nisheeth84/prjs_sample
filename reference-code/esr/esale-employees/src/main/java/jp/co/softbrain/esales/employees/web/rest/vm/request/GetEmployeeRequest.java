package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API getEmployee
 * 
 * @author phamdongdong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeeRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230981095595566820L;
    private Long employeeId;
    private String mode;
}
