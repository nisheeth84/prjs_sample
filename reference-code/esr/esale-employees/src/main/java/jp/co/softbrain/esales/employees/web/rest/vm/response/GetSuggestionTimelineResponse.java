/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType1;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response for API getSuggestionTimeline
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetSuggestionTimelineResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -71590202019475822L;

    /**
     * list employees
     */
    private List<EmployeeInfoDTO> employees;

    /**
     * list departments
     */
    private List<GetEmployeesSuggestionSubType1> departments;
}
