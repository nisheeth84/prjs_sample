package jp.co.softbrain.esales.customers.service.dto.timelines;
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
public class CountTimelinesOutDTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592533728898L;
    private List<CountTimelinesSubType1DTO>          results;
}
