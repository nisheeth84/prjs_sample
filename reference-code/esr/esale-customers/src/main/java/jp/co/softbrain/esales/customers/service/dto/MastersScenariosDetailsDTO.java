package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import jp.co.softbrain.esales.customers.domain.MastersScenariosDetails;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link MastersScenariosDetails}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MastersScenariosDetailsDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 7187094115307958275L;

    /**
     * scenarioDetailId
     */
    private Long scenarioDetailId;

    /**
     * scenarioId
     */
    private Long scenarioId;

    /**
     * The milestoneName
     */
    private String milestoneName;

    /**
     * finishDayType
     */
    private Integer finishDayType;

    /**
     * finishAfterDay
     */
    private Integer finishAfterDay;

    /**
     * finishDate
     */
    private Instant finishDate;
}