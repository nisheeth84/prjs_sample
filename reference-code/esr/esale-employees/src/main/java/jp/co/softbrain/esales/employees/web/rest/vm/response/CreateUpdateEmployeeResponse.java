package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * response for API create/update employee
 * 
 * @author nguyentrunghieu
 *
 */
@Data
@AllArgsConstructor
public class CreateUpdateEmployeeResponse implements Serializable {
    private static final long serialVersionUID = 3882357001883646481L;

    /**
     * employeeId
     */
    private Long employeeId;
}
