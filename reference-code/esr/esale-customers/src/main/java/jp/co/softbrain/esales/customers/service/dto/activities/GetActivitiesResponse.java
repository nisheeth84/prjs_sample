package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities.
 * 
 * @author TinhBV
 */

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2631648316126330715L;
    private List<GetActivitiesSubType1DTO>  activities;
    private GetInitializeListInfoResponse initializeInfo;
    private Long total;
}