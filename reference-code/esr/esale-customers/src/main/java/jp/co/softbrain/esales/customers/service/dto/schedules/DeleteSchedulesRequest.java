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
public class DeleteSchedulesRequest implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1626374822227L;

    private List<Long> customerIds;
}
