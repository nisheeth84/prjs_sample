package jp.co.softbrain.esales.employees.service.dto;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * Request for API GetProductTradingsRequest
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class GetProductTradingsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7788772334457472478L;

    /**
     * isOnlyData
     */
    private Boolean isOnlyData;

    /**
     * searchLocal
     */
    private String searchLocal;

    /**
     * searchConditions
     */
    private List<SearchItem> searchConditions = new LinkedList<>();

    /**
     * filterConditions
     */
    private List<SearchItem> filterConditions = new LinkedList<>();

    /**
     * isFirstLoad
     */
    private Boolean isFirstLoad;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId;

    /**
     * orderBy
     */
    private List<OrderValue> orders = new LinkedList<>();

    /**
     * offset
     */
    private Integer offset = 0;

    /**
     * limit
     */
    private Integer limit = 30;

    /**
     * viewMode
     */
    private short viewMode;

    /**
     * customerIds
     */
    private List<Long> customerIdFilters;

    /**
     * productIdFilters
     */
    private List<Long> productIdFilters;

    /**
     * employeeIdFilters
     */
    private List<Long> employeeIdFilters;
}
