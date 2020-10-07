package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.CustomersList;
import jp.co.softbrain.esales.customers.service.dto.CustomersListDTO;

/**
 * Mapper for the entity {@link Customers} and its DTO
 * 
 * @author nguyenductruong
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomersListMapper extends EntityMapper<CustomersListDTO, CustomersList> {

    default CustomersList fromId(Long id) {
        if (id == null) {
            return null;
        }
        CustomersList customersList = new CustomersList();
        customersList.setCustomerListId(id);
        return customersList;
    }
}
