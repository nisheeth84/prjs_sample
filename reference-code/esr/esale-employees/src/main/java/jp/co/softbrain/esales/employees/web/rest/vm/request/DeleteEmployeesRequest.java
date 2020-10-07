package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author phamminhphu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeleteEmployeesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7386532474815464639L;
    private List<Long> employeeIds;
    private List<Instant> updatedDates;
}
