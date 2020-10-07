/**
 * 
 */
package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.ItemReflectDTO;

/**
 * * Mapper for the DTO {@link ItemReflectDTO} and {@link ItemReflect}.
 * 
 * @author nguyenhaiduong
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface ItemReflectDTOMapper
        extends EntityMapper<ItemReflectDTO, jp.co.softbrain.esales.customers.service.dto.commons.ItemReflectDTO> {

}
