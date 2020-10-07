package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the response parameters of getProductTradings API.
 *
 * @author ThanhDv
 */
@Data
@EqualsAndHashCode
public class FilterListConditionOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 9048572458875270552L;

    /**
     * targetType
     */
    private Integer targetType;

    /**
     * targetId
     */
    private Long targetId;

    /**
     * List filterConditions
     */
    private List<SearchItem> filterConditions;
}
