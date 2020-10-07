package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * RelationsWithCustomersDTO
 */
@Data
@EqualsAndHashCode
public class RelationsWithCustomersDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8379434847219282894L;

    private Long customerId;

    private List<TasksByCustomerDTO> listTasks = new ArrayList<>();

    private List<SchedulesByCustomerDTO> listSchedules = new ArrayList<>();

}
