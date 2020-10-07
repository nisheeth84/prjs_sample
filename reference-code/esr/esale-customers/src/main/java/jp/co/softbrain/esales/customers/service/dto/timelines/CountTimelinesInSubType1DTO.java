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
public class CountTimelinesInSubType1DTO implements Serializable {
    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 1592533762999L;
    /**
     * The fieldBelongType
     */
    private Integer                                  inputType;
    /**
     * The inputId
     */
    private List<Long>                               inputId;
}
