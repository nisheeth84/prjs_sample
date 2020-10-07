package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request for API initializeGroupModal
 * 
 * @author phamdongdong
 */
@Data
public class GetParticipantDataByIdsRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230980195595566820L;

    private List<Long> participantEmployeeIds;
    private List<Long> participantDepartmentIds;
    private List<Long> participantGroupIds;
}
