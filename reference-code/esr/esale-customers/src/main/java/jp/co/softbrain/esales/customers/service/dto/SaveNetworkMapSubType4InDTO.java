package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SaveNetworkMapSubType4InDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class SaveNetworkMapSubType4InDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -947786493421693909L;

    /**
     * standId
     */
    private Long standId;

    /**
     * motivationId
     */
    private Long motivationId;

    /**
     * tradingProductIds
     */
    private Long tradingProductId;

    /**
     * comment
     */
    private String comment;

}
