package jp.co.softbrain.esales.employees.web.rest.vm.request;

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
