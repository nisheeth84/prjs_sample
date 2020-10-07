package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.domain.NetworksStands;
import jp.co.softbrain.esales.customers.service.dto.NetworksStandsDTO;

/**
 * Mapper for the entity {@link NetworksStands} and its DTO
 * 
 * @author phamminhphu
 *
 */
@Mapper(componentModel = "spring", uses = {})
public interface NetworksStandsMapper extends EntityMapper<NetworksStandsDTO, NetworksStands> {

    default NetworksStands fromId(Long id) {
        NetworksStands networksStands = null;
        if (id != null) {
            networksStands = new NetworksStands();
            networksStands.setNetworkStandId(id);
        }
        return networksStands;
    }
}
