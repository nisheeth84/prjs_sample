/**
 * 
 */
package jp.co.softbrain.esales.employees.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.ItemChoiceDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetSuggestionTimelineResponse;

/**
 * Service for suggestion of Employees
 * 
 * @author phamminhphu
 */
@XRayEnabled
public interface SuggestionEmployeeService {

    /**
     * @param keyWords
     *            word to search
     * @param listItemChoice
     *            item choice
     * @param timelineGroupId
     *            id timeline group
     * @param offset
     *            offset
     * @return Response Object
     */
    public GetSuggestionTimelineResponse getSuggestionTimeline(String keyWords, List<ItemChoiceDTO> listItemChoice,
            Long timelineGroupId, Long offset);

}
