package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the {@link jp.co.softbrain.esales.activities.domain.Activities} entity.
 * 
 * @author tinhbv
 */

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType9DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4874821754331602057L;

    private Long             taskId;
    private String           taskName;
}