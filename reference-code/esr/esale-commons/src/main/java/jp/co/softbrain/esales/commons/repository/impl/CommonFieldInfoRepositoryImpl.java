package jp.co.softbrain.esales.commons.repository.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository;
import jp.co.softbrain.esales.commons.service.dto.CustomFieldsInfoResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.commons.service.dto.FieldsInfoQueryDTO;
import jp.co.softbrain.esales.commons.service.dto.GetFieldInfoTabsOutSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoSubType2DTO;
import jp.co.softbrain.esales.commons.tenant.util.FieldBelongDefaultUtil.BUSINESS_CARD;
import jp.co.softbrain.esales.commons.tenant.util.FieldBelongDefaultUtil.EMPLOYEE;
import jp.co.softbrain.esales.commons.tenant.util.FieldBelongDefaultUtil.PRODUCT;
import jp.co.softbrain.esales.config.Constants;

/**
 * Spring Data repository for the Common FieldInfo activities.
 */

@Repository
public class CommonFieldInfoRepositoryImpl extends RepositoryCustomUtils implements CommonFieldInfoRepository {

    private static final String STRING_DELETED_FIELDS = "deletedFields";

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * getFieldInfoPersonals(jp.co.softbrain.esales.commons.service.dto.
     * FieldInfoPersonalsInputDTO)
     */
    public List<FieldInfoPersonalResponseDTO> getFieldInfoPersonals(FieldInfoPersonalsInputDTO searchConditions) {

        // Build SQL
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT t2.field_id ");
        sqlBuilder.append("     , t1.field_name ");
        sqlBuilder.append("     , t1.field_label ");
        sqlBuilder.append("     , t1.field_type ");
        sqlBuilder.append("     , t1.field_belong ");
        sqlBuilder.append("     , t1.is_default ");
        sqlBuilder.append("     , t1.max_length ");
        sqlBuilder.append("     , t1.modify_flag ");
        sqlBuilder.append("     , t1.available_flag ");
        sqlBuilder.append("     , t1.is_double_column ");
        sqlBuilder.append("     , t1.default_value ");
        sqlBuilder.append("     , t1.currency_unit ");
        sqlBuilder.append("     , t1.type_unit ");
        sqlBuilder.append("     , t1.decimal_place ");
        sqlBuilder.append("     , t1.select_organization_data ");
        sqlBuilder.append("     , t1.url_type ");
        sqlBuilder.append("     , t1.url_target ");
        sqlBuilder.append("     , t1.url_text ");
        sqlBuilder.append("     , t1.link_target ");
        sqlBuilder.append("     , t1.iframe_height ");
        sqlBuilder.append("     , t1.config_value ");
        sqlBuilder.append("     , t1.is_linked_google_map ");
        sqlBuilder.append("     , t1.field_group ");
        sqlBuilder.append("     , t1.relation_data ");
        sqlBuilder.append("     , t1.difference_setting ");
        sqlBuilder.append("     , t1.tab_data ");
        sqlBuilder.append("     , t1.lookup_field_id ");
        sqlBuilder.append("     , t1.updated_date ");
        sqlBuilder.append("     , t2.field_order ");
        sqlBuilder.append("     , t3.item_id ");
        sqlBuilder.append("     , t3.item_label ");
        sqlBuilder.append("     , t3.item_order ");
        sqlBuilder.append("     , t3.is_default AS item_is_default ");
        sqlBuilder.append("     , t3.is_available AS item_is_available");
        sqlBuilder.append("     , t3.updated_date AS item_updated_date");
        sqlBuilder.append("     , t1.lookup_data  ");
        sqlBuilder.append("     , t2.is_column_fixed ");
        sqlBuilder.append("     , t2.column_width ");
        sqlBuilder.append("     , t2.relation_field_id ");
        sqlBuilder.append("FROM field_info t1 ");
        sqlBuilder.append("INNER JOIN field_info_personal t2  ");
        sqlBuilder.append("       ON (t2.field_id = t1.field_id) ");
        sqlBuilder.append("LEFT JOIN field_info_item t3 ");
        sqlBuilder.append("       ON (t2.field_id = t3.field_id) ");
        sqlBuilder.append("WHERE ");
        if (searchConditions.getSelectedTargetType() != null
                && !searchConditions.getSelectedTargetType().equals(ConstantsCommon.SHARE_LIST)) {
            sqlBuilder.append("		  t2.employee_id = :employeeId AND ");
        }
        sqlBuilder.append("       t2.extension_belong = :extensionBelong ");
        sqlBuilder.append("       AND t2.field_belong = :fieldBelong ");
        if (searchConditions.getSelectedTargetType() != null) {
            sqlBuilder.append("       AND t2.selected_target_type = :selectedTargetType ");
        }
        if (searchConditions.getSelectedTargetId() != null) {
            sqlBuilder.append("       AND t2.selected_target_id = :selectedTargetId ");
        }
        sqlBuilder.append("       AND t1.available_flag > 0 ");
        sqlBuilder.append("ORDER BY ");
        sqlBuilder.append("       t2.field_order ASC, ");
        sqlBuilder.append("       t3.item_order ASC ");

        Map<String, Object> parameters = new HashMap<>();
        if (searchConditions.getSelectedTargetType() != null
                && !searchConditions.getSelectedTargetType().equals(ConstantsCommon.SHARE_LIST)) {
            parameters.put("employeeId", searchConditions.getEmployeeId());
        }
        parameters.put("extensionBelong", searchConditions.getExtensionBelong());
        if (searchConditions.getSelectedTargetType() != null) {
            parameters.put("selectedTargetType", searchConditions.getSelectedTargetType());
        }
        if (searchConditions.getSelectedTargetId() != null) {
            parameters.put("selectedTargetId", searchConditions.getSelectedTargetId());
        }
        parameters.put(ConstantsCommon.PARAM_FIELD_BELONG, searchConditions.getFieldBelong());

        return this.getResultList(sqlBuilder.toString(), "FieldInfoPersonalMapping", parameters);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * getCustomFieldsInfo(java.lang.Integer)
     */
    @Override
    public List<CustomFieldsInfoResponseDTO> getCustomFieldsInfo(Integer fieldBelong, List<Long> fieldIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sqlBuilder.append("SELECT t1.field_id ");
        sqlBuilder.append("     , t1.field_belong ");
        sqlBuilder.append("     , t1.field_name ");
        sqlBuilder.append("     , t1.field_label ");
        sqlBuilder.append("     , t1.field_type ");
        sqlBuilder.append("     , t1.field_order ");
        sqlBuilder.append("     , t1.is_default ");
        sqlBuilder.append("     , t1.max_length ");
        sqlBuilder.append("     , t1.modify_flag ");
        sqlBuilder.append("     , t1.available_flag ");
        sqlBuilder.append("     , t1.is_double_column ");
        sqlBuilder.append("     , t1.default_value ");
        sqlBuilder.append("     , t1.currency_unit ");
        sqlBuilder.append("     , t1.type_unit ");
        sqlBuilder.append("     , t1.decimal_place ");
        sqlBuilder.append("     , t1.url_type ");
        sqlBuilder.append("     , t1.url_target ");
        sqlBuilder.append("     , t1.url_text ");
        sqlBuilder.append("     , t1.link_target ");
        sqlBuilder.append("     , t1.iframe_height ");
        sqlBuilder.append("     , t1.config_value ");
        sqlBuilder.append("     , t1.is_linked_google_map ");
        sqlBuilder.append("     , t1.field_group ");
        sqlBuilder.append("     , t1.lookup_data ");
        sqlBuilder.append("     , t1.relation_data ");
        sqlBuilder.append("     , t1.difference_setting ");
        sqlBuilder.append("     , t1.select_organization_data ");
        sqlBuilder.append("     , t1.statistics_item_flag ");
        sqlBuilder.append("     , t1.statistics_condition_flag ");
        sqlBuilder.append("     , t1.tab_data ");
        sqlBuilder.append("     , t1.lookup_field_id ");
        sqlBuilder.append("     , t1.created_date ");
        sqlBuilder.append("     , t1.created_user ");
        sqlBuilder.append("     , t1.updated_date ");
        sqlBuilder.append("     , t1.updated_user ");
        sqlBuilder.append("     , t2.item_id AS item_item_id ");
        sqlBuilder.append("     , t2.is_available AS item_is_available ");
        sqlBuilder.append("     , t2.item_order AS item_item_order ");
        sqlBuilder.append("     , t2.is_default AS item_is_default ");
        sqlBuilder.append("     , t2.item_label AS item_item_label ");
        sqlBuilder.append("FROM field_info t1 ");
        sqlBuilder.append("LEFT JOIN field_info_item t2 ");
        sqlBuilder.append("       ON t1.field_id = t2.field_id ");
        if (fieldBelong != null) {
            sqlBuilder.append("WHERE t1.field_belong = :fieldBelong ");
            parameters.put(ConstantsCommon.PARAM_FIELD_BELONG, fieldBelong);
        }
        if (fieldIds != null) {
            sqlBuilder.append("WHERE t1.field_id IN (:fieldIds) ");
            parameters.put("fieldIds", fieldIds);
        }
        sqlBuilder.append("ORDER BY t1.field_order ASC ");
        return this.getResultList(sqlBuilder.toString(), "CustomFieldsInfoMapping", parameters);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * countFieldInfoPersonalByFieldIds(java.util.List)
     */
    @Override
    public Long countFieldInfoPersonalByFieldIds(List<Long> fieldIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT  count(1) ");
        sqlBuilder.append(" FROM  field_info ");
        sqlBuilder.append(" WHERE available_flag > 0 ");
        sqlBuilder.append("   AND field_id IN (" + StringUtils.join(fieldIds, ",") + ") ");
        Object count = this.getSingleResult(sqlBuilder.toString());
        return count == null ? Long.valueOf("0") : Long.valueOf(count.toString());
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * getInfoDefaultFields(java.lang.Long)
     */
    @Override
    public List<GetImportInitInfoSubType2DTO> getInfoDefaultFields(Long extensionBelong) {
        // get default keys field
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT f.field_id ");
        sqlBuilder.append("     , f.field_name ");
        sqlBuilder.append("     , f.field_label ");
        sqlBuilder.append("     , f.updated_date AS updated_date ");
        sqlBuilder.append("FROM field_info f ");
        sqlBuilder.append("WHERE f.field_belong = :extensionBelong ");
        sqlBuilder.append("       AND f.field_name IN ");

        switch (extensionBelong.intValue()) {
        case 1:
            sqlBuilder.append("('").append(EMPLOYEE.EMPLOYEE_ID.toString().toLowerCase()).append("')");
            break;
        case 3:
            String businessConditions = Arrays.toString(BUSINESS_CARD.values())
                    .replace(ConstantsCommon.OPEN_BRACKET, "('").replace(ConstantsCommon.CLOSE_BRACKET, "')")
                    .replace(Constants.COMMA, "','").replace(ConstantsCommon.SPACE, ConstantsCommon.EMPTY_STRING)
                    .toLowerCase();
            sqlBuilder.append(businessConditions);
            break;
        case 5:
            String prodConditions = Arrays.toString(PRODUCT.values()).replace(ConstantsCommon.OPEN_BRACKET, "('")
                    .replace(ConstantsCommon.CLOSE_BRACKET, "')").replace(Constants.COMMA, "','")
                    .replace(ConstantsCommon.SPACE, ConstantsCommon.EMPTY_STRING).toLowerCase();
            sqlBuilder.append(prodConditions);
            break;
        default:
            break;
        }

        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCommon.EXTENSION_BELONG_KEY_WORD, extensionBelong);

        return this.getResultList(sqlBuilder.toString(), "FieldObjectMapping", parameters);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * getInfoTextFields(java.lang.Long)
     */
    @Override
    public List<GetImportInitInfoSubType2DTO> getInfoTextFields(Long extensionBelong) {

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT f.field_id ");
        sqlBuilder.append("     , f.field_name ");
        sqlBuilder.append("     , f.field_label ");
        sqlBuilder.append("     , f.updated_date AS updated_date ");
        sqlBuilder.append("FROM field_info f ");
        sqlBuilder.append("WHERE f.is_default = FALSE ");
        sqlBuilder.append("      AND f.field_type = :fieldType ");
        sqlBuilder.append("      AND f.field_belong = :extensionBelong ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCommon.FIELD_TYPE_KEY_WORD, 10);
        parameters.put(ConstantsCommon.EXTENSION_BELONG_KEY_WORD, extensionBelong);

        return this.getResultList(sqlBuilder.toString(), "FieldObjectMapping", parameters);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * getFieldsInfoByFieldBelongTypeId(java.lang.Integer, java.lang.Integer,
     * java.lang.Long)
     */
    @Override
    public List<FieldsInfoQueryDTO> getFieldsInfoByFieldBelongTypeId(Integer fieldBelong, Integer fieldType,
            Long fieldId) {
        // Parameter map
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCommon.PARAM_FIELD_BELONG, fieldBelong);
        // Build SQL
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT  ");
        sqlBuilder.append(" field_id AS fieldId, ");
        sqlBuilder.append(" field_belong AS fieldBelong, ");
        sqlBuilder.append(" field_name AS fieldName,");
        sqlBuilder.append(" field_label AS fieldLabel,");
        sqlBuilder.append(" field_type AS fieldType,");
        sqlBuilder.append(" field_order AS fieldOrder,");
        sqlBuilder.append(" is_default AS isDefault,");
        sqlBuilder.append(" max_length AS maxLength,");
        sqlBuilder.append(" modify_flag AS modifyFlag,");
        sqlBuilder.append(" available_flag AS availableFlag,");
        sqlBuilder.append(" is_double_column AS isDoubleColumn,");
        sqlBuilder.append(" default_value AS defaultValue,");
        sqlBuilder.append(" currency_unit AS currencyUnit,");
        sqlBuilder.append(" type_unit AS typeUnit,");
        sqlBuilder.append(" decimal_place AS decimalPlace,");
        sqlBuilder.append(" url_type AS urlType,");
        sqlBuilder.append(" url_target AS urlTarget,");
        sqlBuilder.append(" url_text AS urlText,");
        sqlBuilder.append(" link_target AS linkTarget,");
        sqlBuilder.append(" iframe_height AS iframeHeight,");
        sqlBuilder.append(" config_value AS configValue,");
        sqlBuilder.append(" is_linked_google_map AS isLinkedGoogleMap,");
        sqlBuilder.append(" field_group AS fieldGroup,");
        sqlBuilder.append(" lookup_data AS lookupData,");
        sqlBuilder.append(" relation_data AS relationData,");
        sqlBuilder.append(" select_organization_data AS selectOrganizationData,");
        sqlBuilder.append(" tab_data AS tabData,");
        sqlBuilder.append(" lookup_field_id AS lookupFieldId,");
        sqlBuilder.append(" created_date AS createdDate,");
        sqlBuilder.append(" created_user AS createdUser,");
        sqlBuilder.append(" updated_date AS updatedDate,");
        sqlBuilder.append(" updated_user AS updatedUser");
        sqlBuilder.append(" FROM field_info");
        sqlBuilder.append(" WHERE field_info.field_belong = :fieldBelong");
        if (fieldType != null) {
            sqlBuilder.append(" AND field_info.field_type = :fieldType");
            parameters.put(ConstantsCommon.PARAM_FIELD_TYPE, fieldType);
            if (fieldId != null) {
                sqlBuilder.append(" AND field_info.field_id = :fieldId");
                parameters.put(ConstantsCommon.PARAM_FIELD_ID, fieldId);
            }
        }
        sqlBuilder.append(" ORDER BY field_info.field_order ASC");
        return this.getResultList(sqlBuilder.toString(), "FieldsInfoMapping", parameters);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * getListField(java.lang.Long)
     */

    @Override
    public List<GetFieldInfoTabsOutSubType3DTO> getListField(Integer fieldBelong) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT fInfo.field_id ");
        sqlBuilder.append("     , fInfo.field_label ");
        sqlBuilder.append("     , fInfo.field_type ");
        sqlBuilder.append("     , fInfo.field_order ");
        sqlBuilder.append("     , fInfo.field_name ");
        sqlBuilder.append("     , fInfoItem.item_id ");
        sqlBuilder.append("     , fInfoItem.item_label ");
        sqlBuilder.append("     , fInfo.updated_date ");
        sqlBuilder.append("FROM field_info fInfo ");
        sqlBuilder.append("LEFT JOIN field_info_item fInfoItem ");
        sqlBuilder.append("       ON fInfo.field_id = fInfoItem.field_id ");
        sqlBuilder.append("       AND fInfoItem.is_available ");
        sqlBuilder.append("WHERE fInfo.field_belong = :fieldBelong ");
        sqlBuilder.append("       AND fInfo.available_flag > 0  ");
        sqlBuilder.append("ORDER BY fInfo.field_order ASC ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ConstantsCommon.PARAM_FIELD_BELONG, fieldBelong);

        return this.getResultList(sqlBuilder.toString(), "ListFieldOfFunctionMapping", parameters);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#
     * getSequenceForFieldName(java.lang.String)
     */
    public Long getSequenceForFieldName(String sequenceName) {
        List<Object> ids = this.getResultList("SELECT nextval('" + sequenceName + "')");
        return Double.valueOf(String.valueOf(ids.get(0))).longValue();
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#countItemLookupData(java.util.List)
     */
    @Override
    public Integer countItemLookupData(List<Long> deletedFields) {
        if (deletedFields == null || deletedFields.isEmpty()) {
            return 0;
        }
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT  count(1) ");
        sqlBuilder.append(" FROM  field_info ");
        sqlBuilder.append(" WHERE (lookup_data->'item_reflect')\\:\\:TEXT LIKE :deletedFieldFirst ");
        String deletedFieldFirst = "%: " + deletedFields.get(0) + "}%";
        parameters.put("deletedFieldFirst", deletedFieldFirst);
        if (deletedFields.size() > 1) {
            for (int i = 1; i < deletedFields.size(); i++) {
                String deletedField = "%: " + deletedFields.get(i) + "}%";
                String key = "deletedField" + i;
                sqlBuilder.append(" OR (lookup_data->'item_reflect')\\:\\:TEXT LIKE :");
                sqlBuilder.append(key);
                parameters.put(key, deletedField);
            }
        }
        List<Object> count = this.getResultList(sqlBuilder.toString(), parameters);
        return Integer.valueOf(count.get(0).toString());
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#countKeyLookupData(java.util.List)
     */
    @Override
    public Integer countKeyLookupData(List<Long> deletedFields) {
        if (deletedFields == null || deletedFields.isEmpty()) {
            return 0;
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT count(1) ");
        sqlBuilder.append(" FROM field_info ");
        sqlBuilder.append("WHERE (lookup_data->'search_key')\\:\\:float8 IN :deletedFields ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(STRING_DELETED_FIELDS, deletedFields);
        List<Object> count = this.getResultList(sqlBuilder.toString(), parameters);
        return Integer.valueOf(count.get(0).toString());
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#countItemRelationList(java.util.List)
     */
    @Override
    public Integer countItemRelationList(List<Long> deletedFields) {
        if (deletedFields == null || deletedFields.isEmpty()) {
            return 0;
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT count(1) ");
        sqlBuilder.append(" FROM field_info ");
        sqlBuilder.append(" WHERE (relation_data->>'display_field_id')\\:\\:float8 IN :deletedFields");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(STRING_DELETED_FIELDS, deletedFields);
        List<Object> count = this.getResultList(sqlBuilder.toString(), parameters);
        return Integer.valueOf(count.get(0).toString());
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#countCalculatorItems(java.util.List)
     */
    @Override
    public Integer countCalculatorItems(List<String> listItemNumberic) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT count(1) ");
        sqlBuilder.append("FROM field_info ");
        sqlBuilder.append("WHERE field_info.field_type = 16 ");
        String deletedFieldFirst = "%''" + listItemNumberic.get(0) + "''%";
        parameters.put("deletedFieldFirst", deletedFieldFirst);
        sqlBuilder.append("AND field_info.config_value LIKE :deletedFieldFirst ");
        if (listItemNumberic.size() > 1) {
            for (int i = 1; i < listItemNumberic.size(); i++) {
                String deletedField = "%''" + listItemNumberic.get(i) + "''%";
                String key = "deletedField"+i;
                sqlBuilder.append(" OR  field_info.config_value LIKE :");
                sqlBuilder.append(key);
                parameters.put(key, deletedField);
            }
        }
        List<Object> count = this.getResultList(sqlBuilder.toString(), parameters);
        return Integer.valueOf(count.get(0).toString());
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository#countItemRelationDetail(java.util.List)
     */
    @Override
    public Integer countItemRelationDetail(List<Long> deletedFields) {
        if (deletedFields == null || deletedFields.isEmpty()) {
            return 0;
        }
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT count(1) ");
        sqlBuilder.append("FROM ");
        sqlBuilder.append("(SELECT jsonb_array_elements(relation_data->'display_fields') ");
        sqlBuilder.append(" AS relation_data ");
        sqlBuilder.append(" FROM field_info) ");
        sqlBuilder.append(" AS relation ");
        sqlBuilder.append(" WHERE (relation_data->>'field_id')\\:\\:float8 IN :deletedFields ");
        sqlBuilder.append(" OR (relation_data->>'relation_id')\\:\\:float8 IN :deletedFields ");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(STRING_DELETED_FIELDS, deletedFields);
        List<Object> count = this.getResultList(sqlBuilder.toString(), parameters);
        return Integer.valueOf(count.get(0).toString());
    }
}
