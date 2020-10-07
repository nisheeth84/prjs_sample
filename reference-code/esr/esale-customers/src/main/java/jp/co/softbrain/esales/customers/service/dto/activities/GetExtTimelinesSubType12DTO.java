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
public class GetExtTimelinesSubType12DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8825060048417755558L;

    private String                                   targetName;
    private Integer                                  targetType;
    private Long                                     targetId;
}
