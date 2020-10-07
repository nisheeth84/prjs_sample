package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.LanguagesDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Language} and its DTO {@link LanguageDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface LanguagesMapper extends EntityMapper<LanguagesDTO, Languages> {



    default Languages fromLanguageId(Long languageId) {
        if (languageId == null) {
            return null;
        }
        Languages language = new Languages();
        language.setLanguageId(languageId);
        return language;
    }
}
