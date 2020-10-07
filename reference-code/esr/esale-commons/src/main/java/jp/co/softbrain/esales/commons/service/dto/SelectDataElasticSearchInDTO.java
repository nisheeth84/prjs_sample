package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The SelectDataElasticSearchInDTO class
 */
@Data
@EqualsAndHashCode
public class SelectDataElasticSearchInDTO implements Serializable {

    private static final long serialVersionUID = -1189365882755473657L;

    /**
     * ElasticSearch index
     */
    private String index;

    /**
     * The offset
     */
    private int offset = 0;

    /**
     * The limit
     */
    private Integer limit;

    /**
     * The search conditions
     */
    private List<SearchItem> searchConditions = new ArrayList<>();

    /**
     * The search or conditions
     */
    private List<SearchItem> searchOrConditions = new ArrayList<>();

    /**
     * The filter conditions
     */
    private List<SearchItem> filterConditions = new ArrayList<>();

    /**
     * The list orderBy
     */
    private List<OrderValue> orderBy = new ArrayList<>();
    
    /**
     * language code (en_us, ja_jp, zh_cn)
     */
    private String languageCode = "ja_jp";

}
