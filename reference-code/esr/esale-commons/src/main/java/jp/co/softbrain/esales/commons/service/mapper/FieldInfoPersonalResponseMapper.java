package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsOutDTO;

/**
 * Mapper for the DTO {@link FieldInfoPersonalResponseDTO} and its DTO {@link FieldInfoPersonalsOutDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldInfoPersonalResponseMapper {
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    @Mapping(target = "selectOrganizationData", ignore = true)
    @Mapping(target = "differenceSetting", ignore = true)
    @Mapping(target = "tabData", ignore = true)
	FieldInfoPersonalsOutDTO toResponseWrapper(FieldInfoPersonalResponseDTO reponseDto);
}
