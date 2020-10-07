package jp.co.softbrain.esales.uaa.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.uaa.domain.IpAddress;
import jp.co.softbrain.esales.uaa.service.dto.IpAddressDTO;

/**
 * Mapper for the entity {@link IpAddress} and its DTO {@link IpAddressDTO}.
 * 
 * @author QuangLV
 */
@Mapper(componentModel = "spring", uses = {})
public interface IpAddressMapper extends EntityMapper<IpAddressDTO, IpAddress> {
}
