package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * A DTO for response data Select from ElasticSearch
 */
@Data
public class SelectDataElasticSearchOutDTO implements Serializable {

    private static final long serialVersionUID = -1189365882755473657L;

    /**
     * The total
     */
    private long total;

    /**
     * The data output
     */
    private List<Map<String, Object>> data = new ArrayList<>();
}
