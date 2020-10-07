package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * GetAccessLogsInDTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class GetAccessLogsInDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 1655947330934580612L;

    /**
     * The dateFrom
     */
    private String dateFrom;

    /**
     * The dateTo
     */

    private String dateTo;

    /**
     * The searchLocal
     */
    private String searchLocal;

    /**
     * The limit
     */
    private Long limit;

    /**
     * The offset
     */
    private Long offset;

    /**
     * The isInitialInfo
     */
    private Boolean isInitialInfo;

    /**
     * The filterConditions
     */
    private List<FilterConditionsDTO> filterConditions;

    /**
     * The orderBy
     */
    private List<OrderByDTO> orderBy;

    /**
     * The isDefaultSort
     */
    private Boolean isDefaultSort;

}
