package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SharedTimeLineDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class SharedTimeLineDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2007760162975017344L;

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
     * timelineGroupId
     */
    private Integer timelineGroupId;
    /**
     * timelineGroupName
     */
    private String timelineGroupName;
    /**
     * imagePath
     */
    private String imagePath;
    /**
     * objectRelate
     */
    private ObjectRelateDTO objectRelate;
    /**
     * comment
     */
    private String comment;

}
