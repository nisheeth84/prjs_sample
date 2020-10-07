/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupSearchConditionInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Response for API getGroupSearchCondition
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetGroupSearchConditionInfoResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1794651239300326086L;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * groupName
     */
    private String groupName;

    /**
     * searchConditions
     */
    private List<EmployeeGroupSearchConditionInfoDTO> employeesGroupSearchConditionInfos;
}
