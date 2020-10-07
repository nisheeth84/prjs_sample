package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * ScheduleCountByEmployeeDTO
 */
@Data
@EqualsAndHashCode
public class ScheduleCountByEmployeeDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2047430084770728128L;

    /**
     * customerId
     */
    private Long employeeId;

    /**
     * groups of employee
     */
    private List<Long> groupIds = new ArrayList<>();

    /**
     * department of employee
     */
    private List<Long> departmentIds = new ArrayList<>();

    /**
     * number of schedule
     */
    private Integer numberOfSchedule;

}
