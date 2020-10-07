package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.MastersScenarios;
import jp.co.softbrain.esales.customers.service.dto.MastersScenariosDTO;

/**
 * Mapper for the entity {@link MastersScenarios} and its DTO {@link MastersScenariosDTO}
 */
@Mapper(componentModel = "spring", uses = {})
public interface MastersScenariosMapper extends EntityMapper<MastersScenariosDTO, MastersScenarios> {

    default MastersScenarios fromId(Long id) {
        if (id == null) {
            return null;
        }
        MastersScenarios scenarios = new MastersScenarios();
        scenarios.setScenarioId(id);
        return scenarios;
    }
}