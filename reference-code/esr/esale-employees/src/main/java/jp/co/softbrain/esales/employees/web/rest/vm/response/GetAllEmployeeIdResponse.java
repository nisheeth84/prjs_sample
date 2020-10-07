package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Response entity for API get-all-employee-id
 *
 * @author phamhoainam
 */
@Data
public class GetAllEmployeeIdResponse implements Serializable {
    private static final long serialVersionUID = -5335468897331461230L;

    private List<Long> employeeIds;
}
