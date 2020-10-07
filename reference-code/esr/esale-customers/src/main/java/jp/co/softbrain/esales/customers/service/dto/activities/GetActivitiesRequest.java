package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API getActivities
 * 
 * @author tinhbv
 */
@Data
@EqualsAndHashCode
public class GetActivitiesRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2666416907827443874L;

    private List<Long> listBusinessCardId;
    private List<Long> listCustomerId;
    private List<Long> listProductTradingId;
    private String searchLocal;
    private List<SearchItem> searchConditions;
    private List<SearchItem> filterConditions;
    private Boolean isFirstLoad;
    private Integer selectedTargetType;
    private Long selectedTargetId;
    private List<OrderValue> orderBy;
    private Integer offset;
    private Integer limit;
    private Boolean hasTimeline;
    private Boolean isUpdateListView;
}
