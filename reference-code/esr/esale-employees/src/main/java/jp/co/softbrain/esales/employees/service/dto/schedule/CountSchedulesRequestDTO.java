package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CountSchedulesRequest
 */
@Data
@EqualsAndHashCode
public class CountSchedulesRequestDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7285001132783713054L;

    /**
     * customerIds
     */
    private List<Long> customerIds;

    /**
     * employeeIds
     */
    private List<Long> employeeIds;

}
