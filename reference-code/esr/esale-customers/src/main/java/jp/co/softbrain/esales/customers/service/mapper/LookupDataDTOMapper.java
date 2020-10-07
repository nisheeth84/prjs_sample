/**
 * 
 */
package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * * Mapper for the DTO {@link LookupDataDTO} and {@link LookupData}.
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface LookupDataDTOMapper {

    @Mapping(target = "itemReflect", ignore = true)
    jp.co.softbrain.esales.customers.service.dto.LookupDataDTO toGrpcWithoutItemReflect(
            jp.co.softbrain.esales.customers.service.dto.commons.LookupDataDTO data);

    @Mapping(target = "itemReflect", ignore = true)
    jp.co.softbrain.esales.customers.service.dto.LookupDataDTO toDTOWithoutItemReflect(
            jp.co.softbrain.esales.customers.service.dto.commons.LookupDataDTO data);
}
