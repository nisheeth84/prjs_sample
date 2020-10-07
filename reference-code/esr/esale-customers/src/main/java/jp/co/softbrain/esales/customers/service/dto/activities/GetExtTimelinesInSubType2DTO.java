package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author tinhbv
 */
import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class GetExtTimelinesInSubType2DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1594127268L;

    private Boolean                         isOnlyUnreadTimeline;
    private List<Long>                      filterOptions;
}
