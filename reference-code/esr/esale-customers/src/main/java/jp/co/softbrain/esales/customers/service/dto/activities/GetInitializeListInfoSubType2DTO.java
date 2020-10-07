package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API getInitializeListInfo.
 */
@Data
@EqualsAndHashCode
public class GetInitializeListInfoSubType2DTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -2068753313052102583L;

    /**
     * targetType
     */
    private Integer targetType;

    /**
     * targetId
     */
    private Long targetId;

    /**
     * List filterConditions
     */
    private List<SearchItem> filterConditions;
}
