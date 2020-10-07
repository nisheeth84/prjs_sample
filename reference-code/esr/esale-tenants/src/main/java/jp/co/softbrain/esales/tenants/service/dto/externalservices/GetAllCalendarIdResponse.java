package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Response entity for API get-all-calendar-id
 *
 * @author phamhoainam
 */
@Data
public class GetAllCalendarIdResponse implements Serializable {

    private static final long serialVersionUID = 191883980655532140L;

    private List<Long> calendarId;
}
