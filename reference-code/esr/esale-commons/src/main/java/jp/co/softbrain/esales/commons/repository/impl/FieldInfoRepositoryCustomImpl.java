package jp.co.softbrain.esales.commons.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.repository.FieldInfoCustomRepository;
import jp.co.softbrain.esales.commons.service.dto.FieldRelationItem1DTO;

/**
 * Service Implementation for {@link FieldInfoCustomRepository}.
 *
 * @author Trungnd
 */
@Repository
public class FieldInfoRepositoryCustomImpl extends RepositoryCustomUtils implements FieldInfoCustomRepository {

    /**
     * @see FieldInfoCustomRepository#getFieldRelationByFieldBelong(Integer)
     */
    @Override
    public List<FieldRelationItem1DTO> getFieldRelationByFieldBelong(Integer fieldBelong) {
        StringBuilder sql = new StringBuilder();
        Map<String, Object> parameters = new HashMap<>();
        sql.append("SELECT   f.field_id, ");
        sql.append("        f.field_name,  ");
        sql.append("        f.field_label, ");
        sql.append("        fr.field_belong AS relationFieldBelong, ");
        sql.append("        fr.field_id AS relationFieldId, ");
        sql.append("        fr.field_label AS relationFieldLabel ");
        sql.append("FROM field_info f ");
        sql.append("INNER JOIN field_info fr ");
        sql.append("           ON (f.relation_data -> 'field_belong')\\:\\:INT =  fr.field_belong ");
        sql.append("WHERE    f.available_flag = 3 ");
        sql.append("     AND f.field_belong = :fieldBelong ");
        sql.append("     AND f.field_type = 17 ");
        sql.append("     AND fr.available_flag = 3 ");
        sql.append("     AND (fr.field_type = 9 OR  ( ");
        sql.append("          fr.field_name = (CASE                                             ");
        sql.append("                        WHEN fr.field_belong = 4 THEN 'business_card_id'    ");
        sql.append("                        WHEN fr.field_belong = 5 THEN 'customer_id'         ");
        sql.append("                        WHEN fr.field_belong = 6 THEN 'activity_id'         ");
        sql.append("                        WHEN fr.field_belong = 8 THEN 'employee_id'         ");
        sql.append("                        WHEN fr.field_belong = 14 THEN 'product_id'         ");
        sql.append("                        WHEN fr.field_belong = 15 THEN 'task_id'            ");
        sql.append("                        WHEN fr.field_belong = 16 THEN 'product_trading_id' ");
        sql.append("                        ELSE ''                                             ");
        sql.append("                    END) ))                                                  ");
        sql.append("ORDER BY f.field_id ASC, fr.field_belong ASC, fr.field_order ASC ");
        parameters.put(ConstantsCommon.PARAM_FIELD_BELONG, fieldBelong);

        return this.getResultList(sql.toString(), "getFieldRelationByFieldBelong", parameters);
    }
    
}
