package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request for API getSelectedOrganizationInfo
 * @author phamdongdong
 *
 */
@Data
public class GetSelectedOrganizationInfoRequest implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230981095595666020L;
    private List<Long> employeeId;
    private List<Long> departmentId;
    private List<Long> groupId;
}
