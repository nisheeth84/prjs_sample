package jp.co.softbrain.esales.commons.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.repository.FieldInfoTabsRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType2DTO;

/**
 * Repository custom implements for field info tab
 */
@Repository
public class FieldInfoTabsRepositoryCustomImpl extends RepositoryCustomUtils implements FieldInfoTabsRepositoryCustom {

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.repository.FieldInfoTabsRepositoryCustom#
     * getFieldInfoTabs(java.lang.Long, java.lang.Long, java.lang.String)
     */
    @Override
    public List<GetFieldInfoTabsOutSubType2DTO> getFieldInfoTabs(Integer tabBelong, Integer tabId) {
        // Build SQL
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT fInfoTab.field_id ");
        sqlBuilder.append("     , fInfoTab.field_info_tab_id ");
        sqlBuilder.append("     , fInfoTab.updated_date ");
        sqlBuilder.append("     , fInfoTabPersonal.field_info_tab_personal_id ");
        sqlBuilder.append("     , fInfoTabPersonal.is_column_fixed ");
        sqlBuilder.append("     , fInfoTabPersonal.column_width ");
        sqlBuilder.append("     , fInfo.field_order ");
        sqlBuilder.append("     , fInfo.field_name ");
        sqlBuilder.append("     , fInfo.field_label ");
        sqlBuilder.append("     , fInfo.field_type ");
        sqlBuilder.append("     , fInfoItem.item_id ");
        sqlBuilder.append("     , fInfoItem.item_label ");
        sqlBuilder.append("FROM field_info_tab fInfoTab ");
        sqlBuilder.append("INNER JOIN field_info fInfo ");
        sqlBuilder.append("       ON fInfoTab.field_id = fInfo.field_id ");
        sqlBuilder.append("LEFT JOIN field_info_item fInfoItem ");
        sqlBuilder.append("       ON fInfoTab.field_id = fInfoItem.field_id ");
        sqlBuilder.append("       AND fInfoItem.is_available ");
        sqlBuilder.append("LEFT JOIN field_info_tab_personal fInfoTabPersonal ");
        sqlBuilder.append("       ON fInfoTab.field_info_tab_id = fInfoTabPersonal.field_info_tab_id ");
        sqlBuilder.append("WHERE fInfoTab.tab_belong = :tabBelong  ");
        sqlBuilder.append("       AND fInfoTab.tab_id = :tabId  ");
        sqlBuilder.append("       AND fInfo.available_flag > 0  ");
        sqlBuilder.append("ORDER BY fInfoTab.field_order ASC ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("tabBelong", tabBelong);
        parameters.put("tabId", tabId);
        return this.getResultList(sqlBuilder.toString(), "GetFieldInfoTabsSubType2Mapping", parameters);
    }
}
