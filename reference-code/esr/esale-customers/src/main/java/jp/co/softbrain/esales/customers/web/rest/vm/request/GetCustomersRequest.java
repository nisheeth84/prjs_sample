package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;

/**
 * GetCustomersRequest
 */
@Data
public class GetCustomersRequest implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7091567810270051055L;

    private List<SearchItem> searchConditions;
    private List<SearchItem> filterConditions;
    private String localSearchKeyword;
    private Integer selectedTargetType;
    private Long selectedTargetId;
    private Boolean isUpdateListView;
    private List<OrderValue> orderBy;
    private Integer offset;
    private Integer limit;

}
