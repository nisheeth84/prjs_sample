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
public class CountTimelinesForm implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1592533759040L;
    /**
     * The inputParam
     */
    private CountTimelinesInSubType1DTO              inputParam;
    /**
     * The countType
     */
    private List<Integer>                            countType;
}
