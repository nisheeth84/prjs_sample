package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CustomerFavouriteMenuOutDTO
 * 
 * @author Kientt
 *
 */
@Data
@EqualsAndHashCode
public class DeleteSchedulesResponse implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 162637484847L;

    private List<Long> scheduleIds;
}
