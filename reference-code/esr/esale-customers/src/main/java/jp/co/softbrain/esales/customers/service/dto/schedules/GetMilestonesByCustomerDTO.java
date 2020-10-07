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
 * Get mile stone by stone by customer id
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetMilestonesByCustomerDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2190714835062971119L;

    private Long customerId;
    private Long milestoneId;
    private String milestoneName;
    private String memo;
    private List<Long> listTaskIds = new ArrayList<>();
    private List<GetMilestonesByCustomerSubType1DTO> listTask = new ArrayList<>();
    private Instant endDate;
    private Integer isDone;
    private Boolean isPublic;
    private Instant createdDate;
    private Long createdUserId;
    private String createdUserName;
    private Instant updatedDate;
    private Long updatedUserId;
    private String updatedUserName;
}
