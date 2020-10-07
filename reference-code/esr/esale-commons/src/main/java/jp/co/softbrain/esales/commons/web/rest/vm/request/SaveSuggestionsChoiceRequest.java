package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.SuggestionsChoiceDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * View model for API saveSuggestionsChoice
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveSuggestionsChoiceRequest implements Serializable {

    private static final long serialVersionUID = -387363099258578050L;

    /**
     * sugggestionChoie
     */
    private List<SuggestionsChoiceDTO> sugggestionsChoice;

}
