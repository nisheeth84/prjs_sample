package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Out DTO for api getTasksAndSchedulesByCustomerIds
 */
@Data
@EqualsAndHashCode
public class TaskAndScheduleByCustomerOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3322115836163496532L;

    private List<RelationsWithCustomersDTO> customerRelations = new ArrayList<>();

}
