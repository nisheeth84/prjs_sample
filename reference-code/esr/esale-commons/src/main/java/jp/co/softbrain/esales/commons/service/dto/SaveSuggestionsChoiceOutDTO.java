package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SaveSuggestionsChoiceOutDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class SaveSuggestionsChoiceOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7346246246235252645L;

    /**
     * suggestionChoiceId
     */
    private List<Long> suggestionChoiceId;

}
