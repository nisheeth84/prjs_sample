package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.SuggestionsChoice;
import jp.co.softbrain.esales.commons.service.dto.SuggestionsChoiceDTO;

/**
 * Mapper for the entity {@link SuggestionsChoice} and its DTO
 * {@link SuggestionsChoiceDTO}.
 * 
 * @author chungochai
 */
@Mapper(componentModel = "spring", uses = {})
public interface SuggestionsChoiceMapper extends EntityMapper<SuggestionsChoiceDTO, SuggestionsChoice> {
    
    default SuggestionsChoice fromId(Long suggestionsChoiceId) {
        if (suggestionsChoiceId == null) {
            return null;
        }
        SuggestionsChoice suggestionsChoice = new SuggestionsChoice();
        suggestionsChoice.setSuggestionsChoiceId(suggestionsChoiceId);
        return suggestionsChoice;
    }

}
