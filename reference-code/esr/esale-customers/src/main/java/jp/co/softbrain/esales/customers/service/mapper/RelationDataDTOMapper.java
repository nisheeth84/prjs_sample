/**
 * 
 */
package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.RelationDataDTO;

/**
 * * Mapper for the DTO {@link RelationDataDTO} and {@link RelationData}.
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface RelationDataDTOMapper {
    @Mapping(target = "displayFields", ignore = true)
    RelationDataDTO toDto(jp.co.softbrain.esales.customers.service.dto.commons.RelationDataDTO sources);
}
