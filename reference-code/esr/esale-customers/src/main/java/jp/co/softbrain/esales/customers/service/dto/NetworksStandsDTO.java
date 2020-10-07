package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.NetworksStands;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for the entity {@link NetworksStands}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NetworksStandsDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 2597462548841726671L;

    /**
     * networkStandId
     */
    private Long networkStandId;

    /**
     * businessCardCompanyId
     */
    private Long businessCardCompanyId;

    /**
     * businessCardDepartmentId
     */
    private Long businessCardDepartmentId;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * standId
     */
    private Long standId;

    /**
     * motivationId
     */
    private Long motivationId;

    /**
     * productTradingId
     */
    private Long productTradingId;

    /**
     * comment
     */
    private String comment;
}
