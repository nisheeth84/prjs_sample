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
public class GetActivitiesSubType10DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1816939329838476085L;

    private Long             scheduleId;
    private String           scheduleName;
}