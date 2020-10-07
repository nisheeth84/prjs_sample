package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * CustomerSyncDataElasticSeachRequest
 */
@Data
public class CustomerSyncDataElasticSeachRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5829579875119834342L;

    /**
     * customerListIds
     */
    private List<Long> customerListIds;

    /**
     * customerIds
     */
    private List<Long> customerIds;

    /**
     * action - DELETE(0), INSERT(1), UPDATE(2);
     */
    private Integer action;

}
