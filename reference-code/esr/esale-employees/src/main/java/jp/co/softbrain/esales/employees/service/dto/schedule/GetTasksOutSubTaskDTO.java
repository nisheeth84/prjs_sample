package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksOutSubTaskDTO
 * 
 * @author TranTheDuy
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetTasksOutSubTaskDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 5047589825121345854L;

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
}
