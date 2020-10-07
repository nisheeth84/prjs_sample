package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO output for API getOperatorsOfTasks
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class GetOperatorsOfTasksSubType3DTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -3767502668425161644L;

    /**
     * The EmployeesDepartments departmentName
     */
    private String departmentName;

    /**
     * The EmployeesDepartments positionName
     */
    private String positionName;
}
