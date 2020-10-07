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
public class GetTimelineGroupsOutDTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 8909647025929467473L;
    private List<GetTimelineGroupsSubType1DTO>                                  timelineGroup;
}
