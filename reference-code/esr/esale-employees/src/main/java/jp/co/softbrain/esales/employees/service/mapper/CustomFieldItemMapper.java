package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import jp.co.softbrain.esales.employees.service.dto.CustomFieldItemDTO;

/**
 * Mapper for the entity {@link CustomFieldItemDTO} and {@link FieldItems}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomFieldItemMapper {

    @Mapping(target = "isAvailable", ignore = true)
    @Mapping(target = "itemOrder", ignore = true)
    @Mapping(target = "isDefault", ignore = true)
    CustomFieldItemDTO toCustomFieldItemDTO(jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsItemResponseDTO source);
}
