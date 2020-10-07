package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.MastersScenariosDetails;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDetailsDTO;

/**
 * Mapper for the entity {@link MastersScenariosDetails} and its DTO
 * {@link MastersScenariosDetailsDTO}
 */
@Mapper(componentModel = "spring", uses = {})
public interface MastersScenariosDetailsMapper extends EntityMapper<MastersScenariosDetailsDTO, MastersScenariosDetails> {

    default MastersScenariosDetails fromId(Long id) {
        if (id == null) {
            return null;
        }
        MastersScenariosDetails mastersScenariosDetails = new MastersScenariosDetails();
        mastersScenariosDetails.setScenarioDetailId(id);
        return mastersScenariosDetails;
    }
}
