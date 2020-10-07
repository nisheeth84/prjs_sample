package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoInDTO;

/**
 * Mapper for the DTO {@link UpdateCustomFieldsInfoInDTO} and its DTO
 * {@link FieldInfoDTO}.
 * 
 * @author chungochai
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldInfoWithoutDataMapper {

    /**
     * Map FieldInfoDTO from UpdateCustomFieldsInfoInDTO
     * 
     * @param updateCustomFieldsInfoInDTO data need for map
     * @return FieldInfoDTO has been mapped
     */
    @Named("mapWithoutData")
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    @Mapping(target = "selectOrganizationData", ignore = true)
    @Mapping(target = "isDefault", ignore = true)
    @Mapping(target = "maxLength", ignore = true)
    @Mapping(target = "fieldBelong", ignore = true)
    @Mapping(target = "fieldName", ignore = true)
    @Mapping(target = "tabData", ignore = true)
    @Mapping(target = "differenceSetting", ignore = true)
    FieldInfoDTO toFieldInfoDTOWithoutSomeData(UpdateCustomFieldsInfoInDTO updateCustomFieldsInfoInDTO);
}
