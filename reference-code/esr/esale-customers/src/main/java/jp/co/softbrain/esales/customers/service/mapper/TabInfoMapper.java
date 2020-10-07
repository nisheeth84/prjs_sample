package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.customers.service.dto.GetCustomerOutTabsInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.TabsInfoDTO;

/**
 * TabInfoMapper
 *
 * @author lequyphuc
 */
@Mapper(componentModel = "spring", uses = {})
public interface TabInfoMapper extends EntityMapper<GetCustomerOutTabsInfoDTO, TabsInfoDTO> {
}
