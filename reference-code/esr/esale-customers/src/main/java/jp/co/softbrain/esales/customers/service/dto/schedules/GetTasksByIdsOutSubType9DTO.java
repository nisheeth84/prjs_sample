package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksByIdsOutSubType9DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetTasksByIdsOutSubType9DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 16236235352353L;
    /**
     * taskId
     */
    private Long taskId;
    /**
     * statusTaskId
     */
    private Integer statusTaskId;
    /**
     * taskName
     */
    private String taskName;
    /**
     * startDate
     */
    private String startDate;
    /**
     * finishDate
     */
    private String finishDate;
    /**
     * memo
     */
    private String memo;

}
