package jp.co.softbrain.esales.employees.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * GetBusinessCardsTabRequest
 *
 * @author dangngockhiem
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetBusinessCardsTabRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6114039007158497878L;

    /**
     * offset
     */
    private Long offset = 1L;

    /**
     * limit
     */
    private Long limit;

    /**
     * filterConditions
     */
    private List<SearchItem> filterConditions;
    /**
     * orders
     */
    private List<OrderValue> orderBy;
    /**
     * loginFlag
     */
    private Boolean loginFlag = false;
    /**
     * employeeId
     */
    private Long employeeId;
    /**
     * customerId
     */
    private Long customerId;
}
