package jp.co.softbrain.esales.employees.service.dto.timelines;

/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author hieudn
 */
import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetTimelineGroupsSubType3DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -8239533662485559818L;
    /**
     * The parentId
     */
    private Long parentId;
    /**
     * The parentName
     */
    private String parentName;
    /**
     * The employeeId
     */
    private List<Long> employeeId;
    /**
     * The employeeName
     */
    private List<String> employeeName;
}
