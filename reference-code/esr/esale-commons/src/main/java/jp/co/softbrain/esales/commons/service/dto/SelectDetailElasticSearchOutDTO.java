package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;

/**
 * A DTO for response data Select from ElasticSearch
 */
@Data
public class SelectDetailElasticSearchOutDTO implements Serializable {

    private static final long serialVersionUID = 2102166380862760163L;

    /**
     * The total
     */
    private long total;

    /**
     * The data output
     */
    private List<Map<String, Object>> data = new ArrayList<>();

    private List<SearchItem> organizationSearchConditions = new ArrayList<>();

    private List<SearchItem> organizationFilterConditions = new ArrayList<>();

    private List<SearchItem> relationSearchConditions = new ArrayList<>();

    private List<SearchItem> relationFilterConditions = new ArrayList<>();
}
