package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * DTO class for method CustomersListServiceImpl.checkOwnerEmployeeLoginOfList
 * 
 * @author nguyenhaiduong
 */
@Data
public class ListParticipantsDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 7954636706151772774L;

    /**
     * employeeId
     */
    private List<Long> employeeIds;

    /**
     * departmentId
     */
    private List<Long> departmentIds;

    /**
     * departmentId
     */
    private List<Long> groupIds;

}
