package jp.co.softbrain.esales.employees.service.dto.timelines;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetTimelineGroupsForm implements Serializable {
    

    /**
     * 
     */
    private static final long serialVersionUID = -2673596789352117371L;

    /**
	 * The timelineGroupIds
	 */
	private List<Long> timelineGroupIds;

	/**
	 * The sortType
	 */
	private Integer sortType;
}
