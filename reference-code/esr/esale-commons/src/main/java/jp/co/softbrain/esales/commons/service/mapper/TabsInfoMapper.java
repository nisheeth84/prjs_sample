package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.TabsInfo;
import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;

/**
 * Mapper for the entity {@link TabsInfo} and its DTO {@link TabsInfoDTO}.
 * 
 * @author buithingocanh
 */
@Mapper(componentModel = "spring", uses = {})
public interface TabsInfoMapper extends EntityMapper<TabsInfoDTO, TabsInfo> {
    default TabsInfo fromId(Long tabInfoId) {
        if (tabInfoId == null) {
            return null;
        }
        TabsInfo tabsInfo = new TabsInfo();
        tabsInfo.setTabInfoId(tabInfoId);
        return tabsInfo;
    }

}
