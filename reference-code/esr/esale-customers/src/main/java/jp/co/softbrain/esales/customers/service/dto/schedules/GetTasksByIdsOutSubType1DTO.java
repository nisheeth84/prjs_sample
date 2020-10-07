package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksByIdsOutSubType1DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class GetTasksByIdsOutSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 13763576324534L;

    /**
     * employees
     */
    private List<GetOperatorsOfTasksSubType2DTO> employees = new ArrayList<>();
    /**
     * departments
     */
    private List<GetTasksByIdsOutSubType3DTO> departments= new ArrayList<>();
    /**
     * groups
     */
    private List<GetTasksByIdsOutSubType4DTO> groups= new ArrayList<>();
}
