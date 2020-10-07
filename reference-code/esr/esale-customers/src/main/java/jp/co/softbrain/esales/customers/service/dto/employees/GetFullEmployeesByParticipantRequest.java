package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * GetFullEmployeesByParticipantRequest
 * 
 * @author nguyenhaiduong
 */
@Data
public class GetFullEmployeesByParticipantRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4814563433317565626L;

    /**
     * employeeIds
     */
    private List<Long> employeeIds;

    /**
     * departmentIds
     */
    private List<Long> departmentIds;

    /**
     * groupIds
     */
    private List<Long> groupIds;

}
