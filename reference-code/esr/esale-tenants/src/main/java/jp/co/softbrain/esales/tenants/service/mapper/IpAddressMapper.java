package jp.co.softbrain.esales.tenants.service.mapper;

import jp.co.softbrain.esales.tenants.domain.IpAddress;
import jp.co.softbrain.esales.tenants.service.dto.IpAddressDTO;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Mapper for the entity {@link IpAddress} and its DTO {@link IpAddressDTO}.
 *
 * @author QuangLV
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface IpAddressMapper extends EntityMapper<IpAddressDTO, IpAddress> {
}
