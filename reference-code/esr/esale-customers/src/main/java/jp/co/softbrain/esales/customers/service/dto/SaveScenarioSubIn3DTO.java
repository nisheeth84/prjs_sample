/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for subtask
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class SaveScenarioSubIn3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3427821112831457566L;
    private Long taskId;
    private String taskName;
    private Integer status;
    private Instant startDate;
    private Instant finishDate;
    private Long milestoneId;
    private String memo;
    private Boolean isDone;
    private Boolean flagDelete;
}
