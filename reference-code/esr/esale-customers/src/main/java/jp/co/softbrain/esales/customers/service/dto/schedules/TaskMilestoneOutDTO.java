package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * TaskMilestoneOutput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
public class TaskMilestoneOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4570467410867174492L;
    /**
     * The Task Id
     */
    private Long taskId;
    /**
     * The Task Name
     */
    private String taskName;

    /**
     * The Task Name
     */
    private Integer statusTaskId;

    public TaskMilestoneOutDTO(Long taskId, String taskName) {
        this.taskId = taskId;
        this.taskName = taskName;
    }

    public TaskMilestoneOutDTO(Long taskId, String taskName, Integer statusTaskId) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.statusTaskId = statusTaskId;
    }

}
