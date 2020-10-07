package jp.co.softbrain.esales.employees.service.dto.timelines;

/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author hieudn
 */
import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetTimelineGroupsSubType2DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 4663881985191946165L;
    /**
     * The inviteId
     */
    private Long inviteId;
    /**
     * The inviteType
     */
    private Integer inviteType;
    /**
     * The inviteName
     */
    private String inviteName;
    /**
     * The inviteImagePath
     */
    private String inviteImagePath;
    /**
     * The employeeNames
     */
    private GetTimelineGroupsSubType3DTO departments;
    /**
     * The employeeNames
     */
    private GetTimelineGroupsSubType4DTO employees;
    /**
     * The status
     */
    private Integer status;
    /**
     * The authority
     */
    private Integer authority;
}
