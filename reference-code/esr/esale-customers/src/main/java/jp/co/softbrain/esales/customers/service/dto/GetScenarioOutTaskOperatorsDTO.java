package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetScenarioOutTaskOperatorsDTO
 */
@Data
@EqualsAndHashCode
public class GetScenarioOutTaskOperatorsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1247042140439896511L;

    private List<EmployeesOfTaskDTO> employees = new ArrayList<>();

    private List<DepartmentsOfTaskDTO> departments = new ArrayList<>();

    private List<GroupsOfTaskDTO> groups = new ArrayList<>();

}
