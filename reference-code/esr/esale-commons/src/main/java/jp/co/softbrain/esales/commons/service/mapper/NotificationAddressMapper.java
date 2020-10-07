package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.NotificationAddress;
import jp.co.softbrain.esales.commons.service.dto.NotificationAddressDTO;

/**
 * Mapper for the entity {@link NotificationAddress} and its DTO
 * {@link NotificationAddressDTO}.
 * 
 * @author QuangLV
 */
@Mapper(componentModel = "spring", uses = {})
public interface NotificationAddressMapper extends EntityMapper<NotificationAddressDTO, NotificationAddress> {
}