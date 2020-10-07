/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.ItemChoiceDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API getSuggestionTimeline
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetSuggestionTimelineRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7861117438967087817L;

    /**
     * keyWords
     */
    private String keyWords;

    /**
     * listItemChoice
     */
    private List<ItemChoiceDTO> listItemChoice;

    /**
     * timelineGroupId
     */
    private Long timelineGroupId;

    /**
     * offSet
     */
    private Long offset;
}
