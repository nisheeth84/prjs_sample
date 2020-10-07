package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.ListViewSettingsFilters;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsFiltersDTO;

/**
 * Mapper for the entity {@link ListViewSettingsFilters} and its dto
 * {@link ListViewSettingsFiltersDTO}
 * 
 * @author nguyenvanchien3
 */
@Mapper(componentModel = "spring", uses = {})
public interface ListViewSettingsFiltersMapper
        extends EntityMapper<ListViewSettingsFiltersDTO, ListViewSettingsFilters> {

    default ListViewSettingsFilters fromId(Long listViewSettingsFiltersId) {
        if (listViewSettingsFiltersId == null) {
            return null;
        }
        ListViewSettingsFilters listViewSettingsFilters = new ListViewSettingsFilters();
        listViewSettingsFilters.setListViewSettingId(listViewSettingsFiltersId);
        return listViewSettingsFilters;
    }
}
