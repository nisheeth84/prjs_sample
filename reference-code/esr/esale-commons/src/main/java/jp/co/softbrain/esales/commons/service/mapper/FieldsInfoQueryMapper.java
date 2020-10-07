/**
 * 
 */
package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import jp.co.softbrain.esales.commons.service.dto.FieldsInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldsInfoQueryDTO;

/**
 * Mapper for the DTO {@link FieldsInfoOutDTO} and its query DTO
 * {@link FieldsInfoQueryDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldsInfoQueryMapper {
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    @Mapping(target = "selectOrganizationData", ignore = true)
    @Mapping(target = "tabData", ignore = true)
    FieldsInfoOutDTO toFieldInfoOut(FieldsInfoQueryDTO source);
}
