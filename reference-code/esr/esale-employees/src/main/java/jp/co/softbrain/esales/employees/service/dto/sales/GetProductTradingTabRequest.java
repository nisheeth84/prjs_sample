package jp.co.softbrain.esales.employees.service.dto.sales;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
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
    private List<Long> customerIds = new ArrayList<>();

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
    private Integer offset = ConstantsEmployees.DEFAULT_OFFSET;

    /**
     * limit
     */
    private Integer limit = ConstantsEmployees.DEFAULT_LIMIT;

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
