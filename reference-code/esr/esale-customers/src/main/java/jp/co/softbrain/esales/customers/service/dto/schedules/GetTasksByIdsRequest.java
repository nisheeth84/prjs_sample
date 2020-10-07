package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksByIdsRequest
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class GetTasksByIdsRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1241482824874561440L;

    /**
     * taskIds
     */
    private List<Long> taskIds;
    /**
     * employeeId
     */
    private Long employeeId;

}
