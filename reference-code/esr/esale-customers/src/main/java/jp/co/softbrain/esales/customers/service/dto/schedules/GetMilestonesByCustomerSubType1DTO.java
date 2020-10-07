/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * List task for API getMileStone by customer
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetMilestonesByCustomerSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3880615414481578319L;

    private Long taskId;
    private String taskName;
    private Integer status;
    private Instant updatedDate;
    private Long parentTaskId;
    private Integer parentStatusTaskId;
    private Long customerId;
    private String memo;
    private Instant startDate;
    private Instant finishtDate;
    private List<OperatorOfTaskDTO> operators = new ArrayList<>();
}
