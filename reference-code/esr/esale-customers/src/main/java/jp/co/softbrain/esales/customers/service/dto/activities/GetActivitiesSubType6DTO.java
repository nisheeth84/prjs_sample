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
public class GetActivitiesSubType6DTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 682937153152530177L;

    private Long            customerRelationId;
    private String          customerName;
}