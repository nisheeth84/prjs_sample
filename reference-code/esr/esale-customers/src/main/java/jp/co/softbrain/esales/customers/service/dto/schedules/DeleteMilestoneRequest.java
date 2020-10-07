package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DeleteMilestoneRequest
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class DeleteMilestoneRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4399277290100448736L;

    /**
     * milestoneId
     */
    Long milestoneId;
}
