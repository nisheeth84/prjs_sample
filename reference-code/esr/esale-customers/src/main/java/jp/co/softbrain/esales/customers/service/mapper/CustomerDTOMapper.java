package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersHistoriesDTO;

/**
 * Mapper for the {@link CustomersDTO} and its DTO
 * {@link CustomersHistoriesDTO}.
 * 
 * @author buithingocanh
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface CustomerDTOMapper extends EntityMapper<CustomersHistoriesDTO, CustomersDTO> {

}
