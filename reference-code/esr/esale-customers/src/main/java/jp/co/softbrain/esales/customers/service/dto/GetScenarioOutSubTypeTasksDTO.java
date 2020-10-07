package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class out DTO sub type for API getScenario - tasks
 */
@Data
@EqualsAndHashCode
public class GetScenarioOutSubTypeTasksDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1584135108444318900L;

    /**
     * taskId
     */
    private Long taskId;

    /**
     * taskName
     */
    private String taskName;

    /**
     * memo
     */
    private String memo;

    /**
     * statusTaskId
     */
    private Integer statusTaskId;

    /**
     * startDate
     */
    private Instant startDate;

    /**
     * finishDate
     */
    private Instant finishDate;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    /**
     * parentId
     */
    private Long parentId;

    /**
     * nestedOperators
     */
    private List<GetScenarioOutSubTypeEmployeesDTO> nestedOperators = new ArrayList<>();

    /**
     * operators
     */
    private List<GetScenarioOutTaskOperatorsDTO> operators = new ArrayList<>();

    /**
     * subTasks
     */
    private List<GetScenarioOutSubTypeTasksDTO> subTasks = new ArrayList<>();
}
