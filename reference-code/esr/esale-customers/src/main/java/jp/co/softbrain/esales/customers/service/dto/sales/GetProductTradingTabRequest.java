package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API CountProductTrading
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class GetProductTradingTabRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7788733223777472478L;

    /**
     * customerIds
     */
    private List<Long> customerIds;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * loginFlag
     */
    private Boolean loginFlag;

    /**
     * productId
     */
    private Long productId;

    /**
     * currentPage
     */
    private Integer offset = ConstantsCustomers.DEFAULT_OFFSET;

    /**
     * limit
     */
    private Integer limit = ConstantsCustomers.DEFAULT_LIMIT;

    /**
     * searchConditions
     */
    private List<SearchItem> filterConditions = new LinkedList<>();

    /**
     * orderBy
     */
    private List<OrderValue> orderBy =  new LinkedList<>();

    /**
     * isFinish
     */
    private Boolean isFinish;
}
