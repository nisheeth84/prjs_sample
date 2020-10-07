package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.BaseDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API getInitializeListInfo.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GetInitializeListInfoSubType1DTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -828352812200245606L;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId;

    /**
     * extraSettings
     */
    private List<KeyValue> extraSettings;

    /**
     * orderBy
     */
    private List<OrderValue> orderBy;

    /**
     * List filterListConditions
     */
    private List<GetInitializeListInfoSubType2DTO> filterListConditions;
}
