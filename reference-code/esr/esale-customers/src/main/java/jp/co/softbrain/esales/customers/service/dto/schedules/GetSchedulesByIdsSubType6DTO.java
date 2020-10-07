package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for GetSchedulesByIdsOutDTO
 *
 * @author trungbh
 *
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsSubType6DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4028176935510493650L;
    /**
     * employees
     */
    private List<GetSchedulesByIdsSubType7DTO> employees;
    /**
     * departments
     */
    private List<GetSchedulesByIdsSubType8DTO> departments;
    /**
     * groups
     */
    private List<GetSchedulesByIdsSubType9DTO> groups;
    /**
     * allEmployees
     */
    private List<GetSchedulesByIdsSubType10DTO> allEmployees;
}
