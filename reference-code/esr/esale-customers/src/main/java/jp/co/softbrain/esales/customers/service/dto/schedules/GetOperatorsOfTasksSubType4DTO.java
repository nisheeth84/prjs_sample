package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * OperatorsDetailOutput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
public class GetOperatorsOfTasksSubType4DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8262934641964620262L;
    /**
     * employees
     */
    private List<GetOperatorsOfTasksSubType2DTO> employees;
    /**
     * departments
     */
    private List<GetTaskSubType12DTO> departments;
    /**
     * groups
     */
    private List<GetTaskSubType13DTO> groups;

}
