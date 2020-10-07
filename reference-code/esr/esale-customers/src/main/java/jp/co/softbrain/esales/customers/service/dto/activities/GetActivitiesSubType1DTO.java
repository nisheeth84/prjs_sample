package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities.
 * 
 * @author TinhBV
 */

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.schedules.GetSchedulesByIdsOutDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType1DTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 25197613723254517L;

    private Long                            activityId;
    private Long                            activityDraftId;
    private Instant                         contactDate;
    private Instant                         activityStartTime;
    private Instant                         activityEndTime;
    private Instant                         createdDate;
    private Instant                         updatedDate;
    private Long                            activityDuration;
    private GetActivitiesSubType2DTO        employee;
    private List<GetActivitiesSubType3DTO>  businessCards;
    private List<String>                    interviewers;
    private GetActivitiesSubType4DTO        customer;
    private List<GetActivitiesSubType5DTO>  productTradings;
    private List<GetActivitiesSubType6DTO>  customerRelations;
    private String                          memo;
    private GetActivitiesSubType7DTO        createdUser;
    private GetActivitiesSubType8DTO        updatedUser;
    private GetExtTimelinesSubType1DTO      extTimeline;
    private GetActivitiesSubType9DTO        task;
    private GetActivitiesSubType10DTO       schedule;
    private GetActivitiesSubType11DTO       milestone;
    private GetSchedulesByIdsOutDTO         nextSchedule;
}