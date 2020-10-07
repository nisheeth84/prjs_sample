/**
 * 
 */
package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.ItemReflectDTO;

/**
 * * Mapper for the DTO {@link ItemReflectDTO} and {@link ItemReflect}.
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface ItemReflectGrpcMapper extends EntityMapper<ItemReflectDTO, jp.co.softbrain.esales.employees.service.dto.commons.ItemReflectDTO> {

}
