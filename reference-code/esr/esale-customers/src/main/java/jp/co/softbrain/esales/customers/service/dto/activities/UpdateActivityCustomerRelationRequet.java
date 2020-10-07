package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * UpdateActivityCustomerRelationRequet
 */
@Data
@EqualsAndHashCode
public class UpdateActivityCustomerRelationRequet implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2271495842374350046L;

    /**
     * customerIds
     */
    private List<Long> customerIds;

    /**
     * customerIdUpdate
     */
    private Long customerIdUpdate;

}
