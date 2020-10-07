/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.schedules.OperatorsInput;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Save scenatio sub in DTO
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class SaveScenarioSubIn2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 287726205546026284L;

    private Long taskId;
    private String taskName;
    private Integer statusTaskId;
    private Instant startDate;
    private Instant finishDate;
    private Long milestoneId;
    private String memo;
    private Boolean flagDelete;
    private Long parentId;
    private List<OperatorsInput> operators;
    private Instant updatedDate;

    private List<SaveScenarioSubIn3DTO> subTasks;
}
