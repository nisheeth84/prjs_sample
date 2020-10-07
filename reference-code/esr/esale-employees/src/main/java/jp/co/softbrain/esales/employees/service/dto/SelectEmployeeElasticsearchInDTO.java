package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode()
public class SelectEmployeeElasticsearchInDTO implements Serializable {

    private static final long serialVersionUID = -4150161881954723326L;

    /**
     * search conditions
     */
    private List<SearchItem> searchConditions;
    
    /**
     * search conditions
     */
    private List<SearchItem> searchOrConditions;
    
    /**
     * filter conditions
     */
    private List<SearchItem> filterConditions;
    
    /**
     * local keyword
     */
    private String localSearchKeyword;
    
    /**
     * selected target type
     */
    private Integer selectedTargetType;
    
    /**
     * selected target id
     */
    private Integer selectedTargetId;
    
    /**
     * order by
     */
    private List<OrderValue> orderBy;
    
    /**
     * offset to get
     */
    private Long offset;
    
    /**
     * limit record to get
     */
    private Long limit;
    
    /**
     * localumn id
     */
    private String columnId;
}
