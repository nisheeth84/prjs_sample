package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CountSchedulesResponseDTO
 */
@Data
@EqualsAndHashCode
public class CountSchedulesResponseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7453110357816384972L;

    /**
     * countScheduleByCustomers
     */
    private List<ScheduleCountByCustomerDTO> countScheduleByCustomers;

    /**
     * countScheduleByEmployees
     */
    private List<ScheduleCountByEmployeeDTO> countScheduleByEmployees;

}
