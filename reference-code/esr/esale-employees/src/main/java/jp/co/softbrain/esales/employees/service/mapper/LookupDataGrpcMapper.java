/**
 * 
 */
package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.LookupDataDTO;

/**
 * * Mapper for the DTO {@link LookupDataDTO} and {@link LookupData}.
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface LookupDataGrpcMapper {

    @Mapping(target = "itemReflect", ignore = true)
    jp.co.softbrain.esales.employees.service.dto.commons.LookupDataDTO toGrpcWithoutItemReflect(LookupDataDTO data);

    @Mapping(target = "itemReflect", ignore = true)
    LookupDataDTO toDTOWithoutItemReflect(jp.co.softbrain.esales.employees.service.dto.commons.LookupDataDTO data);
}
