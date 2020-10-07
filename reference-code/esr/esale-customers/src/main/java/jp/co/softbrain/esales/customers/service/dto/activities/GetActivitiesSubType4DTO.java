package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities - object customer.
 * 
 * @author TinhBV
 */

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType4DTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -2223009501480878562L;

    private Long            customerId;
    private String          customerName;
}