package jp.co.softbrain.esales.customers.service.dto.timelines;
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
public class CountTimelinesSubType1DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592533753511L;
    private Integer                                  countType;
    private Long                                     id;
    private Long                                     result;
}
