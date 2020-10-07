package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.FieldsResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;

/**
 * * Mapper for the DTO {@link FieldsResponseDTO} and
 * 
 * @author nguyenhaiduong
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface FieldsResponseDTOMapper {

    @Named(value = "toDTOWithoutNestedObject")
    @Mapping(target = "fieldItems", ignore = true)
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    FieldsResponseDTO toDto(CustomFieldsInfoOutDTO sources);

    @Named(value = "toGrpcWithoutNestedObject")
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    FieldsResponseDTO toGrpc(CustomFieldsInfoOutDTO sources);
}
