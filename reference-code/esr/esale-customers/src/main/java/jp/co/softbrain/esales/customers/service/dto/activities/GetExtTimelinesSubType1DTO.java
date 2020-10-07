package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author tinhbv
 */
import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class GetExtTimelinesSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1592306034940L;
    private Long                                     timelineId;
    private Long                                     parentId;
    private Long                                     rootId;
    private Integer                                  timelineType;
    private Long                                     createdUser;
    private String                                   createdUserName;
    private String                                   createdUserPhoto;
    private Instant                                  createdDate;
    private Instant                                  changedDate;
    private Long                                     timelineGroupId;
    private String                                   timelineGroupName;
    private String                                   color;
    private String                                   imagePath;
    private List<GetExtTimelinesSubType12DTO>        targetDelivers;
    private GetExtTimelinesSubType2DTO               header;
    private GetExtTimelinesSubType11DTO              comment;
    private GetExtTimelinesSubType3DTO               sharedTimeline;
    private List<GetExtTimelinesSubType4DTO>         attachedFiles;
    private List<GetExtTimelinesSubType5DTO>         reactions;
    private Boolean                                  isFavorite;
    private List<GetExtTimelinesSubType6DTO>         commentTimelines;
}
