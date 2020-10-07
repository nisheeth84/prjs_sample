package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * QuotedTimelineDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class QuotedTimelineDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6156074244579205075L;

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
     * comment
     */
    private String comment;

}
