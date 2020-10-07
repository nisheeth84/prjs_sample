package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.employees.EmployeesWithEmployeeDataFormatDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * TaskGroupsDetailOutput
 *
 * @author haodv
 */
@Data
@EqualsAndHashCode
public class GetTaskSubType13DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8053180403189551088L;
    /**
     * groupId
     */
    private Long groupId;
    /**
     * groupName
     */
    private String groupName;
    /**
     * photoGroupImg
     */
    private String photoGroupImg;
    /**
     * employees
     */
    private List<EmployeesWithEmployeeDataFormatDTO> employees;

}
