package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.CustomersListParticipants;
import jp.co.softbrain.esales.customers.service.dto.CustomersListParticipantsDTO;

/**
 * Mapper for the entity {@link CustomersListParticipants} and its DTO
 * {@link CustomersListParticipantsDTO}
 */
@Mapper(componentModel = "spring", uses = {})
public interface CustomersListParticipantsMapper extends EntityMapper<CustomersListParticipantsDTO, CustomersListParticipants> {

    default CustomersListParticipants fromId(Long id) {
        if (id == null) {
            return null;
        }
        CustomersListParticipants customersListParticipants = new CustomersListParticipants();
        customersListParticipants.setCustomerListParticipantId(id);
        return customersListParticipants;
    }
}
