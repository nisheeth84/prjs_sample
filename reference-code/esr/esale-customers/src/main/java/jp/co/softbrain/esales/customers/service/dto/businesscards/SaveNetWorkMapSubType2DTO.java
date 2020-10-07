package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * the businessCardsRemove of {@link SaveNetWorkMapRequest}
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class SaveNetWorkMapSubType2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5213103483223466252L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * departmentId
     */
    private Long departmentId;
}
