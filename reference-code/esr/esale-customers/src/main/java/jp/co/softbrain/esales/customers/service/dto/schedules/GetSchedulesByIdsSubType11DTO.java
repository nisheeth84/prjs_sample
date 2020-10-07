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
public class GetSchedulesByIdsSubType11DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 226859227065436311L;
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
