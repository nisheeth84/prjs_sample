package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.domain.MastersMotivations;
import jp.co.softbrain.esales.customers.service.dto.MasterMotivationInDTO;
import jp.co.softbrain.esales.customers.service.dto.MastersMotivationsDTO;

/**
 * Mapper for the entity {@link Customers} and its DTO
 *
 * @author tuanlv
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface MastersMotivationsMapper extends EntityMapper<MastersMotivationsDTO, MastersMotivations> {

    default MastersMotivations fromId(Long id) {
        if (id == null) {
            return null;
        }
        return new MastersMotivations();
    }

    @Named("toMastersMotivationsDTO")
    @Mapping(target = "backgroundColor" , ignore = true)
    MastersMotivationsDTO toMastersMotivationsDTO(MasterMotivationInDTO source);

}
