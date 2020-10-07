package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Named;

import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.domain.MastersStands;
import jp.co.softbrain.esales.customers.service.dto.MasterStandsInDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersStandsDTO;

/**
 * Mapper for the entity {@link Customers} and its DTO
 *
 * @author tuanlv
 */
@Mapper(componentModel = "spring", uses = {})
public interface MastersStandsMapper extends EntityMapper<MastersStandsDTO, MastersStands> {

    default MastersStands fromId(Long id) {
        if (id == null) {
            return null;
        }
        return new MastersStands();
    }

    @Named("toMastersStandsDTO")
    MastersStandsDTO toMastersStandsDTO(MasterStandsInDTO source);
}
