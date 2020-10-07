package jp.co.softbrain.esales.customers.service.dto.sales;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * A DTO for the response parameters of getProductTradings API.
 *
 * @author ThanhDv
 */
@Data
@EqualsAndHashCode
public class InitializeInfoOutDTO implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 4631483595040609638L;

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
    private List<FilterListConditionOutDTO> filterListConditions;
}
