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
public class GetExtTimelinesSubType7DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592306213124L;
    private Integer                                  targetType;
    private Long                                     targetId;
    private String                                   targetName;
}
