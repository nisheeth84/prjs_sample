package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * the businessCards of {@link SaveNetWorkMapResponse}
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class SaveNetWorkMapSubType4DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6163103483915466253L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * companyId
     */
    private Long companyId;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * standId
     */
    private Long masterStandId;

    /**
     * motivationId
     */
    private Long motivationId;

    /**
     * tradingProductId
     */
    private Long tradingProductId;

    /**
     * comment
     */
    private String comment;
}
