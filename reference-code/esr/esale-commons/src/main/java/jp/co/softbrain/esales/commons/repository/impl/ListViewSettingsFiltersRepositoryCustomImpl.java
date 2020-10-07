package jp.co.softbrain.esales.commons.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.repository.ListViewSettingsFiltersRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.ListViewSettingsFiltersDTO;

/**
 * Spring Data repository for the ListViewSettingsFilters entity
 * 
 * @author TranTheDuy
 */
@Repository
public class ListViewSettingsFiltersRepositoryCustomImpl extends RepositoryCustomUtils
        implements ListViewSettingsFiltersRepositoryCustom {

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.
     * ListViewSettingsFiltersRepositoryCustom#getInformationFilterList(java.
     * lang.Long)
     */
    @Override
    public List<ListViewSettingsFiltersDTO> getInformationFilterList(Long listViewSettingId) {
        StringBuilder sqlQuery = new StringBuilder();
        sqlQuery.append(" SELECT ");
        sqlQuery.append("     list_view_settings_filters.* , ");
        sqlQuery.append("     field_info.field_name, ");
        sqlQuery.append("     field_info.field_belong ");
        sqlQuery.append(" FROM ");
        sqlQuery.append("     list_view_settings_filters ");
        sqlQuery.append(" INNER JOIN field_info ");
        sqlQuery.append("      ON (list_view_settings_filters.filter_value -> 'fieldId')\\:\\:BIGINT = field_info.field_id ");
        sqlQuery.append(" WHERE ");
        sqlQuery.append("     list_view_settings_filters.list_view_setting_id = :listViewSettingId ; ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("listViewSettingId", listViewSettingId);
        return this.getResultList(sqlQuery.toString(), "GetInformationFilterListDTOMapping", parameters);
    }
}
