package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SaveNetworkMapSubType3InDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class SaveNetworkMapSubType3InDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5761719895530097069L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * stands
     */
    private List<SaveNetworkMapSubType4InDTO> stands;

}
