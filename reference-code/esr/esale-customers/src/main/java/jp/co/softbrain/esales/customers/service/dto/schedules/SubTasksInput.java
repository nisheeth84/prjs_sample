package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * SubTasksInput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class SubTasksInput implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8421478721589138009L;
    /**
     * taskId
     */
    private Long taskId;
    /**
     * statusTaskId
     */
    private Integer statusTaskId;
    /**
     * subtaskName
     */
    private String subtaskName;

}
