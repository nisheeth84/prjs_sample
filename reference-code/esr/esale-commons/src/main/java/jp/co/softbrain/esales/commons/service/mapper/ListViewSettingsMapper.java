package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.ListViewSettings;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsDTO;

/**
 * Mapper for the entity {@link ListViewSettings} and its DTO
 * {@link ListViewSettingsDTO}
 * 
 * @author nguyenvanchien3
 */
@Mapper(componentModel = "spring", uses = {})
public interface ListViewSettingsMapper extends EntityMapper<ListViewSettingsDTO, ListViewSettings> {

    default ListViewSettings fromId(Long listViewSettingId) {
        if (listViewSettingId == null) {
            return null;
        }
        ListViewSettings listViewSettings = new ListViewSettings();
        listViewSettings.setListViewSettingId(listViewSettingId);
        return listViewSettings;
    }
}
