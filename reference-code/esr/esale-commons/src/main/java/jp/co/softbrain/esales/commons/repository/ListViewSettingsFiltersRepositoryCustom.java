package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsFiltersDTO;

/**
 * Spring Data repository for the ListViewSettingsFilters entity
 * 
 * @author TranTheDuy
 */
@Repository
public interface ListViewSettingsFiltersRepositoryCustom {

    /**
     * Get information filter list
     * 
     * @param listViewSettingId listViewSettingId
     * @return information filter list
     */
    public List<ListViewSettingsFiltersDTO> getInformationFilterList(Long listViewSettingId);
}
