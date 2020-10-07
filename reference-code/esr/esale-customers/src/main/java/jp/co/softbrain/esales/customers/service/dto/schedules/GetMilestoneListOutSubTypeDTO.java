package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * MilestoneOutput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
public class GetMilestoneListOutSubTypeDTO implements Serializable {

    private static final long serialVersionUID = 1849625534259893974L;

    /**
     * The Milestones ID
     */
    private Long milestoneId;

    /**
     * The Milestones Name
     */
    private String milestoneName;

    /**
     * The Milestones end Date
     */
    private Instant finishDate;

    /**
     * The IsDone
     */
    private Integer statusMilestoneId;

    /**
     * The Memo
     */
    private String memo;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The Calendar Id
     */
    private Long calendarId;

    /**
     * The count task
     */
    private Integer countTask;

    /**
     * The tasks
     */
    private List<TaskMilestoneOutDTO> tasks = new ArrayList<>();

    /**
     * Constructor
     *
     * @param milestoneId
     * @param milestoneName
     * @param finishDate
     * @param statusMilestoneId
     * @param memo
     * @param updatedDate
     * @param calendarId
     */
    public GetMilestoneListOutSubTypeDTO(Long milestoneId, String milestoneName, Instant finishDate,
            Integer statusMilestoneId, String memo, Instant updatedDate, Long calendarId) {
        this.milestoneId = milestoneId;
        this.milestoneName = milestoneName;
        this.finishDate = finishDate;
        this.statusMilestoneId = statusMilestoneId;
        this.memo = memo;
        this.updatedDate = updatedDate;
        this.calendarId = calendarId;
    }

}
