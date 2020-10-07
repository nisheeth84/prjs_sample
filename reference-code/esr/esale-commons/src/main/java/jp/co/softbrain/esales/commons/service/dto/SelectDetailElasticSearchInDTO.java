package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The SelectDetailElasticSearchInDTO class
 */
@Data
@EqualsAndHashCode
public class SelectDetailElasticSearchInDTO implements Serializable {

    private static final long serialVersionUID = 1332685029363411927L;

    /**
     * ElasticSearch index
     */
    private String index;

    /**
     * The offset
     */
    private Integer offset = 0;

    /**
     * The limit
     */
    private Integer limit;

    /**
     * The search conditions
     */
    private List<SearchConditionDTO> searchConditions = new ArrayList<>();

    /**
     * The filter conditions
     */
    private List<SearchConditionDTO> filterConditions = new ArrayList<>();

    /**
     * The list orderBy
     */
    private List<OrderValue> orderBy = new ArrayList<>();
    
    /**
     * language code (en_us, ja_jp, zh_cn)
     */
    private String languageCode = "ja_jp";
    
    /**
     * column id (employee_id, product_id, ....)
     */
    private String columnId;

}
