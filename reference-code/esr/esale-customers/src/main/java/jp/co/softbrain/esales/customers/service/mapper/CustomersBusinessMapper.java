package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.CustomersBusiness;
import jp.co.softbrain.esales.customers.service.dto.CustomersBusinessDTO;

/**
 * Mapper for the entity {@link CustomersBusiness} and its DTO
 * {@link CustomersBusinessDTO}
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomersBusinessMapper extends EntityMapper<CustomersBusinessDTO, CustomersBusiness> {

    default CustomersBusiness fromId(Long id) {
        if (id == null) {
            return null;
        }
        CustomersBusiness customersBusiness = new CustomersBusiness();
        customersBusiness.setCustomerBusinessId(id);
        return customersBusiness;
    }
}
