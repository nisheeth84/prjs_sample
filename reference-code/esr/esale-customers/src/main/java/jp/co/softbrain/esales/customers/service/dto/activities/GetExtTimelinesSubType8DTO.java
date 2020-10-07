package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author tinhbv
 */
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class GetExtTimelinesSubType8DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592306226307L;
    private Long                                     timelineId;
    private Long                                     parentId;
    private Long                                     rootId;
    private GetExtTimelinesSubType11DTO              comment;
}
