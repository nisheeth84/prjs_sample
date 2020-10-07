package jp.co.softbrain.esales.employees.service.dto.timelines;
/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author hieudn
 */
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class GetTimelineGroupsSubType1DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 8557446728178674402L;
    /**
     * The timelineGroupId
     */
    private Long                                     timelineGroupId;
    /**
     * The timelineGroupName
     */
    private String                                   timelineGroupName;
    /**
     * The comment
     */
    private String                                   comment;
    /**
     * The createdDate
     */
    private Instant                                  createdDate;
    /**
     * The isPublic
     */
    private Boolean                                  isPublic;
    /**
     * The color
     */
    private String                                   color;
    /**
     * The imagePath
     */
    private String                                   imagePath;
    /**
     * The imageName
     */
    private String                                   imageName;
    /**
     * The width
     */
    private Integer                                  width;
    /**
     * The height
     */
    private Integer                                  height;
    /**
     * The changedDate
     */
    private Instant                                  changedDate;
    /**
     * The isApproval
     */
    private Boolean                                  isApproval; 
    /**
     * The invites
     */
    private List<GetTimelineGroupsSubType2DTO>                                  invites;
}
