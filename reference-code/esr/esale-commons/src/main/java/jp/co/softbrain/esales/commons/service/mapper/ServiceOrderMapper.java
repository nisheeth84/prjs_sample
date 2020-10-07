package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.MenuServiceOrder;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderDTO;

/**
 * ServiceOrderMapper
 *
 * @author ThaiVV
 */
@Mapper(componentModel = "spring", uses = {})
public interface ServiceOrderMapper extends EntityMapper<ServiceOrderDTO, MenuServiceOrder> {

}
