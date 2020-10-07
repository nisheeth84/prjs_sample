package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetSchedulesByIdsOutDTO
 * 
 * @author trungbh
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsOutDTO implements Serializable {
    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 844260433705229456L;
    /**
     * The activityDraftId
     */
    @JsonIgnore
    private Long        activityDraftId;
    /**
     * scheduleId
     */
    private Long scheduleId;
    /**
     * scheduleType
     */
    private GetSchedulesByIdsSubType1DTO scheduleType;
    /**
     * scheduleName
     */
    private String scheduleName;
    /**
     * startDate
     */
    private Instant startDate;
    /**
     * endDate
     */
    private Instant finishDate;
    /**
     * isFullDay
     */
    private Boolean isFullDay;
    /**
     * isRepeated
     */
    private Boolean isRepeated;
    /**
     * repeatType
     */
    private Integer repeatType;
    /**
     * repeatCycle
     */
    private Long repeatCycle;
    /**
     * regularDayOfWeek
     */
    private String regularDayOfWeek;
    /**
     * regularDayOfMonth
     */
    private String regularDayOfMonth;
    /**
     * regularEndOfMonth
     */
    private String regularEndOfMonth;
    /**
     * repeatEndType
     */
    private String repeatEndType;
    /**
     * repeatEndDate
     */
    private String repeatEndDate;
    /**
     * repeatNumber
     */
    private String repeatNumber;
    /**
     * customers
     */
    private GetSchedulesByIdsSubType2DTO customers;
    /**
     * relatedCustomers
     */
    private List<GetSchedulesByIdsSubType3DTO> relatedCustomers;
    /**
     * zipCode
     */
    private String zipCode;
    /**
     * prefecturesId
     */
    private Long prefecturesId;
    /**
     * prefecturesName
     */
    private String prefecturesName;
    /**
     * addressBelowPrefectures
     */
    private String addressBelowPrefectures;
    /**
     * buildingName
     */
    private String buildingName;
    /**
     * productTradings
     */
    private List<GetSchedulesByIdsSubType4DTO> productTradings;
    /**
     * businessCards
     */
    private List<GetSchedulesByIdsSubType5DTO> businessCards;
    /**
     * participants
     */
    private GetSchedulesByIdsSubType6DTO participants;
    /**
     * sharers
     */
    private GetSchedulesByIdsSubType6DTO sharers;
    /**
     * equipmentTypeId
     */
    private Long equipmentTypeId;
    /**
     * equipments
     */
    private List<GetSchedulesByIdsSubType12DTO> equipments;
    /**
     * note
     */
    private String note;
    /**
     * files
     */
    private List<GetSchedulesByIdsSubType13DTO> files;
    /**
     * tasks
     */
    private List<GetSchedulesByIdsSubType14DTO> tasks;
    /**
     * milestones
     */
    private List<GetSchedulesByIdsSubType15DTO> milestones;
    /**
     * isPublic
     */
    private Boolean isPublic;
    /**
     * canModify
     */
    private Boolean canModify;
}
