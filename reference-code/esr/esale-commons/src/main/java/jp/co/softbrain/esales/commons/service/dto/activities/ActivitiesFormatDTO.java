package jp.co.softbrain.esales.commons.service.dto.activities;

import java.io.Serializable;

import jp.co.softbrain.esales.commons.service.dto.BaseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the
 * {@link jp.co.softbrain.esales.activities.domain.ActivitiesFormats} entity.
 * 
 * @author QuangLV
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ActivitiesFormatDTO extends BaseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -874829784834306344L;

    /**
     * The activityFormatId
     */
    private Long activityFormatId;

    /**
     * The order
     */
    private Long displayOrder;

    /**
     * The language
     */
    private String name;

    /**
     * The fieldUse
     */
    private String fieldUse;

    /**
     * The productTradingFieldUse
     */
    private String productTradingFieldUse;

    /**
     * The isAvailable
     */
    private Boolean isAvailable;

}