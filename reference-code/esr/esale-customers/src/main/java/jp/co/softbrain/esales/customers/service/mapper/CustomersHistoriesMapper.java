package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.domain.CustomersHistories;
import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersHistoriesDTO;

/**
 * Mapper for the entity {@link CustomersHistories} and its DTO
 * {@link CustomersHistoriesDTO}
 * 
 * @author buithingocanh
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface CustomersHistoriesMapper extends EntityMapper<CustomersHistoriesDTO, CustomersHistories> {

    default CustomersHistories fromId(Long id) {
        if (id == null) {
            return null;
        }
        CustomersHistories customersHistories = new CustomersHistories();
        customersHistories.setCustomerHistoryId(id);
        return customersHistories;
    }

    @Named("mapFromCustomersDTO")
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    CustomersHistoriesDTO toCustomersHistoriesDTO(CustomersDTO customerDto);

    @Named("toHistoryEntity")
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    CustomersHistories toHistoryEntity(CustomersDTO customerDto);

}
