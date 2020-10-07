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
public class GetExtTimelinesSubType6DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592306196819L;
    private Long                                     timelineId;
    private Long                                     parentId;
    private Long                                     rootId;
    private Long                                     createdUser;
    private String                                   createdUserName;
    private String                                   createdUserPhoto;
    private Instant                                  createdDate;
    private List<GetExtTimelinesSubType7DTO>         targetDelivers;
    private GetExtTimelinesSubType11DTO              comment;
    private GetExtTimelinesSubType8DTO               quotedTimeline;
    private List<GetExtTimelinesSubType4DTO>         attachedFiles;
    private List<GetExtTimelinesSubType5DTO>         reactions;
    private Boolean                                  isFavorite;
    private List<GetExtTimelinesSubType9DTO>         replyTimelines;
}
