/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.GetDepartmentByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupByNameDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response for api getGroupAndDepartmentByName
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetGroupAndDepartmentByNameResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6464574864462982233L;

    /**
     * groups
     */
    private List<GetGroupByNameDTO> groups;

    /**
     * departments
     */
    private List<GetDepartmentByNameDTO> departments;
}
