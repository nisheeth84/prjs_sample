package jp.co.softbrain.esales.customers.service.dto.products;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetProductsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6568226611463033412L;

    /**
     * searchConditions
     */
    private List<SearchItem> searchConditions;

    /**
     * productCategoryId
     */
    private Long productCategoryId;

    /**
     * isContainCategoryChild
     */
    private Boolean isContainCategoryChild;

    /**
     * searchLocal
     */
    private String searchLocal;

    /**
     * orderBy
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
     * isOnlyData
     */
    private Boolean isOnlyData;

    /**
     * filterConditions
     */
    private List<FilterConditionsSubTypeInDTO> filterConditions;

    /**
     * isUpdateListInfo
     */
    private Boolean isUpdateListInfo;
}
