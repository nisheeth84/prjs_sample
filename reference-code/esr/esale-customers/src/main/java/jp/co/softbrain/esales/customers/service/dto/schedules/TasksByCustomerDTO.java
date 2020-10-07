package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * TasksByCustomerDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class TasksByCustomerDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3890380556330524090L;

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
     * startDate
     */
    private Instant startDate;
    /**
     * finishDate
     */
    private Instant finishDate;
    /**
     * statusTaskId
     */
    private Integer statusTaskId;
    /**
     * isPublic
     */
    private Boolean isPublic;
    /**
     * isPublic
     */
    private Long customerId;
    /**
     * isPublic
     */
    private Instant updatedDate;
    /**
     * parentTaskId
     */
    private Long parentTaskId;
    /**
     * statusParentTaskId
     */
    private Integer statusParentTaskId;
}
