package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CommentTimelineDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CommentTimelineDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3450676291926955621L;

    /**
     * timelineId
     */
    private Long timelineId;
    /**
     * parentId
     */
    private Long parentId;
    /**
     * rootId
     */
    private Long rootId;
    /**
     * createdUser
     */
    private Long createdUser;
    /**
     * createdUserName
     */
    private String createdUserName;
    /**
     * createdUserPhoto
     */
    private String createdUserPhoto;
    /**
     * createdDate
     */
    private Instant createdDate;
    /**
     * targetDelivers
     */
    private List<TargetDeliverDTO> targetDelivers;
    /**
     * comment
     */
    private String comment;
    /**
     * quotedTimeline
     */
    private QuotedTimelineDTO quotedTimeline;
    /**
     * attachedFiles
     */
    private List<AttachedFileDTO> attachedFiles;
    /**
     * reactions
     */
    private List<ReactionDTO> reactions;
    /**
     * isFavourite
     */
    private Boolean isFavourite;

}
