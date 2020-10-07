package jp.co.softbrain.esales.commons.repository.impl;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.repository.ImportHistoriesRepositoryCustom;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportHistoriesDTO;

/**
 * Import Histories Repositories Custom Impl
 *
 * @author LongNV
 *
 */
@Repository
public class ImportHistoriesRepositoryCustomImpl extends RepositoryCustomUtils implements ImportHistoriesRepositoryCustom {

    /**
     * Get import histories
     *
     * @param serviceId serviceId
     * @param importId importId
     * @param orderBy orderBy
     * @param limit limit
     * @param offset offset
     * @param createdDate createdDate
     * @return list record import histories
     */
    @Override
    public List<GetImportHistoriesDTO> getImportHistories(Integer serviceId, Integer importId, OrderByDTO orderBy,
        Integer limit, Integer offset, Instant createdDate) {
        Map<String, Object> parameters = new HashMap<>();
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT ");
        sql.append("     imps.import_file_name, ");
        sql.append("     imps.import_file_path, ");
        sql.append("     imph.* ");
        sql.append(" FROM import_setting imps ");
        sql.append(" LEFT JOIN import_histories imph ");
        sql.append("     ON imps.import_id = imph.import_id ");
        sql.append(" WHERE imps.is_simulation_mode = FALSE ");
        if (serviceId != null) {
            sql.append("     AND imps.service_id = :serviceId ");
            parameters.put("serviceId", serviceId);
        }
        if (createdDate != null) {
            sql.append("     AND imps.created_date >= :createdDate ");
            parameters.put("createdDate", createdDate);
        }
        if (importId != null) {
            sql.append("     AND imps.import_id = :importId ");
            parameters.put("importId", importId);
        }
        if (orderBy != null && orderBy.getKey() != null) {
            sql.append(" ORDER BY :keyOrderBy ");
            parameters.put("keyOrderBy", orderBy.getKey());
            if (orderBy.getValue() != null) {
            	if (orderBy.getValue().equals("ASC")) {
            		sql.append(" ASC ");
            	} else if (orderBy.getValue().equals("DESC")) {
            		sql.append(" DESC ");
            	}
            }
        }
        if (limit != null) {
            sql.append(" LIMIT :limit ");
            parameters.put("limit", limit);
        }
        if (offset != null) {
            sql.append(" OFFSET :offset ");
            parameters.put("offset", offset);
        }
        return this.getResultList(sql.toString(), "GetImportHistoriesMapping" , parameters);
    }
}
