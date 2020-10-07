package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SaveNetworkMapSubType1InDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class SaveNetworkMapSubType1InDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6875540943290050446L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * companyId
     */
    private Long companyId;

    /**
     * departments
     */
    private List<SaveNetworkMapSubType2InDTO> departments;

}
