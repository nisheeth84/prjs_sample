package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * request of GetBusinessCards API
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetBusinessCardsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 9087576202471611042L;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId;

    /**
     * searchConditions
     */
    private List<SearchItem> searchConditions;

    /**
     * orders
     */
    private List<OrderValue> orderBy;

    /**
     * offset
     */
    private Long offset;

    /**
     * limit
     */
    private Long limit;

    /**
     * searchLocal
     */
    private String searchLocal;

    /**
     * filterConditions
     */
    private List<SearchItem> filterConditions;

    /**
     * isFirstLoad
     */
    private Boolean isFirstLoad;

}
