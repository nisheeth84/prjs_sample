package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.CustomersListSearchConditions;
import jp.co.softbrain.esales.customers.service.dto.CustomersListSearchConditionsDTO;

/**
 * Mapper for the entity {@link CustomersListSearchConditions} and its DTO
 * {@link CustomersListSearchConditionsDTO}
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomersListSearchConditionsMapper extends EntityMapper<CustomersListSearchConditionsDTO, CustomersListSearchConditions> {

    default CustomersListSearchConditions fromId(Long id) {
        if (id == null) {
            return null;
        }
        CustomersListSearchConditions customersListSearchConditions = new CustomersListSearchConditions();
        customersListSearchConditions.setCustomerListSearchConditionId(id);
        return customersListSearchConditions;
    }
}
