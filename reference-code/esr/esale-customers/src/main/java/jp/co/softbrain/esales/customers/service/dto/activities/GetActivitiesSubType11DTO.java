package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities.
 * 
 * @author TinhBV
 */

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType11DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6538235060825732529L;


    private Long             milestoneId;
    private String           milestoneName;
}