package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.DataRow;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;

/**
 * A class contain data response for getDataElasticSearch API
 */
@Data
public class SelectDetailElasticSearchResponse implements Serializable {

    private static final long serialVersionUID = 1231599420508623522L;

    /**
     * The total
     */
    private long total = 0;

    /**
     * The list data record
     */
    private List<DataRow> dataElasticSearch = new ArrayList<>();

    private List<SearchItem> organizationSearchConditions = new ArrayList<>();

    private List<SearchItem> organizationFilterConditions = new ArrayList<>();

    private List<SearchItem> relationSearchConditions = new ArrayList<>();

    private List<SearchItem> relationFilterConditions = new ArrayList<>();
}
