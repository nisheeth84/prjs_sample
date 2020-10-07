package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.DataRow;
import lombok.Data;

/**
 * A class contain data response for getDataElasticSearch API
 */
@Data
public class SelectDataElasticSearchResponse implements Serializable {

    private static final long serialVersionUID = 1231599420508623522L;

    /**
     * The total
     */
    private long total = 0;

    /**
     * The list data record
     */
    private List<DataRow> dataElasticSearch = new ArrayList<>();
}
