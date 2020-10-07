package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.CustomFieldsItemResponseDTO;

/**
 * Mapper for the DTO {@link CustomFieldsInfoResponseDTO} and its DTO {@link CustomFieldsInfoOutDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomFieldInfoResponseMapper {
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    @Mapping(target = "selectOrganizationData", ignore = true)
    @Mapping(target = "tabData", ignore = true)
    @Mapping(target = "differenceSetting", ignore = true)
    CustomFieldsInfoOutDTO toResponseWrapper(CustomFieldsInfoResponseDTO reponseDto);

    CustomFieldsItemResponseDTO toResponseWrapperFieldItem(CustomFieldsInfoResponseDTO reponseDto);
}
