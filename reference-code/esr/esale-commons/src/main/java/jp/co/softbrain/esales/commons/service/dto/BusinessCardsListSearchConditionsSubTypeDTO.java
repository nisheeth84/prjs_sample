package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.businesscards.domain.BusinessCardsListSearchConditions}
 * entity.
 *
 * @author thanhdv
 */
@Data
@EqualsAndHashCode
public class BusinessCardsListSearchConditionsSubTypeDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3889694202079886741L;

    /**
     * businessCardListSearchConditionId
     */
    private Long businessCardListSearchConditionId;
    /**
     * fieldId
     */
    private Long fieldId;
    /**
     * searchType
     */
    private Integer searchType;
    /**
     * searchOption
     */
    private Integer searchOption;
    /**
     * searchValue
     */
    private String searchValue;
    /**
     * updatedDate
     */
    private Instant updatedDate;
}
