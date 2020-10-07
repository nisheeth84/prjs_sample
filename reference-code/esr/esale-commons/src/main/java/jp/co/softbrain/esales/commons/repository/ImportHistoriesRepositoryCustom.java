package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.time.Instant;
import org.springframework.stereotype.Repository;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportHistoriesDTO;

/**
 * Import Histories Repositories Custom
 *
 * @author LongNV
 *
 */
@Repository
public interface ImportHistoriesRepositoryCustom {

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
    List<GetImportHistoriesDTO> getImportHistories(Integer serviceId, Integer importId, OrderByDTO orderBy,
            Integer limit, Integer offset, Instant createdDate);
}
