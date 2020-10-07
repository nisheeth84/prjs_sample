package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.CustomersListMembers;
import jp.co.softbrain.esales.customers.service.dto.CustomersListMembersDTO;

/**
 * Mapper for the entity {@link CustomersListMembers} and its DTO
 * {@link CustomersListMembersDTO}
 * 
 * @author nguyenvanchien3
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomersListMembersMapper extends EntityMapper<CustomersListMembersDTO, CustomersListMembers> {

    default CustomersListMembers fromId(Long id) {
        if (id == null) {
            return null;
        }
        CustomersListMembers customersListMembers = new CustomersListMembers();
        customersListMembers.setCustomerListMemberId(id);
        return customersListMembers;
    }

}
