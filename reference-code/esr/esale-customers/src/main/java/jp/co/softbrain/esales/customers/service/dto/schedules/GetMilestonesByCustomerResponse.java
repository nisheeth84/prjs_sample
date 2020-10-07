/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Get Milestones by customer response
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetMilestonesByCustomerResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7697850519410141765L;

    /**
     * milestones
     */
    private List<GetMilestonesByCustomerDTO> milestones = new ArrayList<>();
}
