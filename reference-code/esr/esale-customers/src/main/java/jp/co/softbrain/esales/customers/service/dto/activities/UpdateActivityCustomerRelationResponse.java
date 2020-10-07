package jp.co.softbrain.esales.customers.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * UpdateActivityCustomerRelationResponse
 */
@Data
@EqualsAndHashCode
public class UpdateActivityCustomerRelationResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6735621284657702769L;

    /**
     * activityIds
     */
    private List<Long> activityIds;
}
