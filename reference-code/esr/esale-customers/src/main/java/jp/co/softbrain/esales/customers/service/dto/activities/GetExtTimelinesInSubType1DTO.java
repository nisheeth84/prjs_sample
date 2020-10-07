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
public class GetExtTimelinesInSubType1DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592306317276L;
    private Integer                                  targetType;
    private List<Long>                               targetId;
}
