package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * the businessCards of {@link SaveNetWorkMapRequest}
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class SaveNetWorkMapSubType3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8113103483225466252L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * customerIdSource
     */
    private Long customerIdSource;

    /**
     * departmentIdSource
     */
    private Long departmentIdSource;

    /**
     * departmentNameSource
     */
    private String departmentNameSource;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * <Item>
     */
    private CreateBusinessCardDTO item;

    /**
     * masterStandId
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
