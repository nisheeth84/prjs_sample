package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.CustomFieldInfoResponseWrapperDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;

/**
 * * Mapper for the DTO {@link CustomFieldInfoResponseWrapperDTO} and
 * {@link Fields}
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface CustomFieldInfoResponseWrapperGrpcMapper {

    @Named(value = "toDTOWithoutNestedObject")
    @Mapping(target = "fieldItems", ignore = true)
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    CustomFieldInfoResponseWrapperDTO toDto(CustomFieldsInfoOutDTO sources);

    @Named(value = "toGrpcWithoutNestedObject")
    @Mapping(target = "lookupData", ignore = true)
    @Mapping(target = "relationData", ignore = true)
    CustomFieldInfoResponseWrapperDTO toGrpc(CustomFieldsInfoOutDTO sources);
}
