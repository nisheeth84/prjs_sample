package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * SchedulesByCustomerDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class SchedulesByCustomerDTO implements Serializable  {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 971941876907164566L;

    /**
     * scheduleId
     */
    private Long scheduleId;
    /**
     * scheduleName
     */
    private String scheduleName;
    /**
     * startDate
     */
    private Instant startDate;
    /**
     * finishDate
     */
    private Instant finishDate;
    /**
     * isPublic
     */
    private Boolean isPublic;
    /**
     * canModify
     */
    private Boolean canModify;
    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * customerId
     */
    private Long customerId;

}
