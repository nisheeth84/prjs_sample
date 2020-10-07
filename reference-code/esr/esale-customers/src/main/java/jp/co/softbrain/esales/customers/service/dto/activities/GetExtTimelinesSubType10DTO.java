package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author tinhbv
 */
import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class GetExtTimelinesSubType10DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592306296172L;
    private Long                                     timelineId;
    private Long                                     parentId;
    private Long                                     rootId;
    private Long                                     createdUser;
    private String                                   createdUserName;
    private String                                   createdUserPhoto;
    private Instant                                  createdDate;
    private GetExtTimelinesSubType11DTO              comment;
}
