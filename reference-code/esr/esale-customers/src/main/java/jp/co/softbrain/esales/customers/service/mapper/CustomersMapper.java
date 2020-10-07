package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Named;

import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;

/**
 * Mapper for the entity {@link Customers} and its DTO
 * 
 * @author nguyenductruong
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomersMapper extends EntityMapper<CustomersDTO, Customers> {

    default Customers fromId(Long id) {
        if (id == null) {
            return null;
        }
        Customers customers = new Customers();
        customers.setCustomerId(id);
        return customers;
    }

    /**
     * Clone from DTO
     * 
     * @param sourceDto - source to clone
     * @return DTO clone
     */
    @Named("mapClone")
    CustomersDTO clone(CustomersDTO sourceDto);
}
