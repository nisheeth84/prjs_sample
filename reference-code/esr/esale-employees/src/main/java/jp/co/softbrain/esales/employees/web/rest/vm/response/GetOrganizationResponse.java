/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.GetOrganizationDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationEmployeeDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;
import lombok.Data;

/**
 * Response for API get Organization Response
 * 
 * @author Trungnd
 */
@Data
public class GetOrganizationResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 227254491833517214L;

    /**
     * employee
     */
    private List<GetOrganizationEmployeeDTO> employee;

    /**
     * department
     */
    private List<GetOrganizationDepartmentDTO> department;

    /**
     * group
     */
    private List<GetOrganizationGroupDTO> group;

}
