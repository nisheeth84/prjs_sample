package jp.co.softbrain.esales.commons.service;

import java.io.IOException;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.ImportHistoriesDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateImportHistoryOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportHistoriesRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ImportHistoriesRequestDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateImportHistoryRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ImportHistoriesResponse;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.ImportHistories}.
 *
 * @author chungochai
 */

@XRayEnabled
public interface ImportHistoriesService {

    /**
     * Get import histories
     *
     * @param getImportHistoriesRequest request to save import history
     * @return list record import histories
     */
	ImportHistoriesResponse getImportHistories(GetImportHistoriesRequest getImportHistoriesRequest);

    ImportHistoriesResponse getImportHistory(Long importHistoryId );

    ImportHistoriesDTO save(ImportHistoriesRequestDTO importHistoriesDTO) throws IOException;
    
    /**
     * Update import history
     *
     * @param updateImportHistoryRequest request to save import history
     * @return importHistoryId of the updated record
     */
    UpdateImportHistoryOutDTO updateImportHistory(UpdateImportHistoryRequest updateImportHistoryRequest);

}
