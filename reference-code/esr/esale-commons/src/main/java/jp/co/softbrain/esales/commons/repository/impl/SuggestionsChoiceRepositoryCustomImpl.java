package jp.co.softbrain.esales.commons.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.repository.SuggestionsChoiceRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.GetEmployeeSuggestionsChoiceDTO;

/**
 * Notifications Repository Custom Impl
 *
 * @author phamminhphu
 */
@Repository
public class SuggestionsChoiceRepositoryCustomImpl extends RepositoryCustomUtils implements SuggestionsChoiceRepositoryCustom {

    /**
     * @see jp.co.softbrain.esales.commons.repository.SuggestionsChoiceRepositoryCustom#getEmployeeSuggestionsChoice(java.util.List, java.lang.Long, java.lang.Integer)
     */
    @Override
    public List<GetEmployeeSuggestionsChoiceDTO> getEmployeeSuggestionsChoice(List<String> index, Long employeeId,
            Integer limit) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("       MAX ( suggestions_choice_id ) AS suggestions_choice_id ");
        sql.append("     , index ");
        sql.append("     , id_result ");
        sql.append(" FROM suggestions_choice ");
        sql.append(" WHERE index IN (:index) ");
        sql.append("   AND employee_id = :employeeId ");
        sql.append(" GROUP BY ");
        sql.append("       id_result, ");
        sql.append("       index ");
        sql.append(" ORDER BY suggestions_choice_id DESC ");
        sql.append(" LIMIT :limit ");
        parameters.put("index", index);
        parameters.put("employeeId", employeeId);
        parameters.put("limit", limit);
        return this.getResultList(sql.toString(), "GetEmployeeSuggestionsChoiceMapping", parameters);
    }
}
