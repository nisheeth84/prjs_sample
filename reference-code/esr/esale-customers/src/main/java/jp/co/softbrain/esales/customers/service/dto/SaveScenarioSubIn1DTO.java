/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SaveScenario Sub In DTO
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class SaveScenarioSubIn1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3290169334302005718L;

    /**
     * milestoneId
     */
    private Long milestoneId;

    /**
     * milestoneName
     */
    private String milestoneName;

    /**
     * isDone
     */
    private Integer isDone;

    /**
     * finishDates
     */
    private Instant finishDate;

    /**
     * memo
     */
    private String memo;

    /**
     * flagDelete
     */
    private Boolean flagDelete;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    /**
     * tasks
     */
    private List<SaveScenarioSubIn2DTO> tasks;
}
